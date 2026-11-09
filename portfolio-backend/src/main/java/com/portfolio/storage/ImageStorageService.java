
package com.portfolio.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final String CLOUDINARY_PREFIX = "webora_";

    private final Path uploadDirectory;
    private final String provider;
    private final Cloudinary cloudinary;

    public ImageStorageService(
        @Value("${app.upload.dir:uploads}") String uploadDir,
        @Value("${app.upload.provider:local}") String provider,
        @Value("${cloudinary.cloud-name:}") String cloudName,
        @Value("${cloudinary.api-key:}") String apiKey,
        @Value("${cloudinary.api-secret:}") String apiSecret
    ) {
        this.provider = provider.trim().toLowerCase();

        this.uploadDirectory = Path.of(uploadDir)
            .toAbsolutePath()
            .normalize();

        if (!this.provider.equals("local") &&
            !this.provider.equals("cloudinary")) {
            throw new IllegalStateException(
                "Unsupported image storage provider: " + provider
            );
        }

        if (this.provider.equals("cloudinary")) {
            if (cloudName.isBlank() ||
                apiKey.isBlank() ||
                apiSecret.isBlank()) {
                throw new IllegalStateException(
                    "Cloudinary credentials are missing"
                );
            }

            this.cloudinary = new Cloudinary(
                ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
                )
            );
        } else {
            this.cloudinary = null;

            try {
                Files.createDirectories(uploadDirectory);
            } catch (IOException e) {
                throw new IllegalStateException(
                    "Could not initialize local image storage", e
                );
            }
        }
    }

    public StoredImage store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Please select an image"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Image size must not exceed 5 MB"
            );
        }

        try {
            byte[] bytes = file.getBytes();
            String extension = detectExtension(bytes);

            if (extension == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only valid PNG, JPG and WEBP images are allowed"
                );
            }

            String contentType = switch (extension) {
                case "png" -> "image/png";
                case "webp" -> "image/webp";
                default -> "image/jpeg";
            };

            if (provider.equals("cloudinary")) {
                return storeInCloudinary(
                    bytes, extension, contentType
                );
            }

            return storeLocally(
                bytes, extension, contentType
            );

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Image upload failed"
            );
        }
    }

    private StoredImage storeLocally(
        byte[] bytes,
        String extension,
        String contentType
    ) throws IOException {

        String filename = UUID.randomUUID() + "." + extension;

        Path destination = uploadDirectory
            .resolve(filename)
            .normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid filename"
            );
        }

        Files.write(
            destination,
            bytes,
            StandardOpenOption.CREATE_NEW
        );

        return new StoredImage(
            filename,
            "/api/public/uploads/" + filename,
            contentType,
            bytes.length
        );
    }

    private StoredImage storeInCloudinary(
        byte[] bytes,
        String extension,
        String contentType
    ) throws Exception {

        String publicId = CLOUDINARY_PREFIX + UUID.randomUUID();

        Map<?, ?> result = cloudinary.uploader().upload(
            bytes,
            ObjectUtils.asMap(
                "public_id", publicId,
                "resource_type", "image",
                "overwrite", false,
                "format", extension
            )
        );

        String secureUrl = (String) result.get("secure_url");

        if (secureUrl == null || secureUrl.isBlank()) {
            throw new IllegalStateException(
                "Cloudinary did not return a secure image URL"
            );
        }

        return new StoredImage(
            publicId,
            secureUrl,
            contentType,
            bytes.length
        );
    }

    public Path getImagePath(String filename) {
        if (filename == null ||
            !filename.matches(
                "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\\.(png|jpg|webp)"
            )) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid image filename"
            );
        }

        Path path = uploadDirectory
            .resolve(filename)
            .normalize();

        if (!path.startsWith(uploadDirectory) ||
            !Files.isRegularFile(path)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Image not found"
            );
        }

        return path;
    }

    public void delete(String filename) {
        if (filename == null || filename.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid image identifier"
            );
        }

        if (filename.startsWith(CLOUDINARY_PREFIX)) {
            deleteFromCloudinary(filename);
            return;
        }

        Path path = getImagePath(filename);

        try {
            Files.delete(path);
        } catch (IOException e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not delete image"
            );
        }
    }

    private void deleteFromCloudinary(String publicId) {
        if (cloudinary == null ||
            !publicId.matches("webora_[a-f0-9-]{36}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid Cloudinary image identifier"
            );
        }

        try {
            Map<?, ?> result = cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap(
                    "resource_type", "image",
                    "invalidate", true
                )
            );

            String status = String.valueOf(result.get("result"));

            if (!"ok".equals(status) &&
                !"not found".equals(status)) {
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not delete Cloudinary image"
                );
            }

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not delete Cloudinary image"
            );
        }
    }

    private String detectExtension(byte[] bytes) {
        if (bytes.length >= 8 &&
            (bytes[0] & 0xFF) == 0x89 &&
            bytes[1] == 0x50 &&
            bytes[2] == 0x4E &&
            bytes[3] == 0x47 &&
            bytes[4] == 0x0D &&
            bytes[5] == 0x0A &&
            bytes[6] == 0x1A &&
            bytes[7] == 0x0A) {
            return "png";
        }

        if (bytes.length >= 3 &&
            (bytes[0] & 0xFF) == 0xFF &&
            (bytes[1] & 0xFF) == 0xD8 &&
            (bytes[2] & 0xFF) == 0xFF) {
            return "jpg";
        }

        if (bytes.length >= 12 &&
            bytes[0] == 'R' &&
            bytes[1] == 'I' &&
            bytes[2] == 'F' &&
            bytes[3] == 'F' &&
            bytes[8] == 'W' &&
            bytes[9] == 'E' &&
            bytes[10] == 'B' &&
            bytes[11] == 'P') {
            return "webp";
        }

        return null;
    }

    public record StoredImage(
        String filename,
        String url,
        String contentType,
        long size
    ) {}
}
