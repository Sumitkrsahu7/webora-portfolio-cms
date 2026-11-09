
package com.portfolio.storage;

import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.concurrent.TimeUnit;

@RestController
public class ImageController {

    private final ImageStorageService storageService;

    public ImageController(ImageStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(
        value = "/api/admin/uploads",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public UploadResponse upload(
        @RequestParam("file") MultipartFile file
    ) {
        var stored = storageService.store(file);

        return new UploadResponse(
            stored.filename(),
            stored.url(),
            stored.contentType(),
            stored.size()
        );
    }

    @GetMapping("/api/public/uploads/{filename:.+}")
    public ResponseEntity<Resource> getImage(
        @PathVariable String filename
    ) throws IOException {

        var path = storageService.getImagePath(filename);
        Resource resource = new FileSystemResource(path);

        String contentType = Files.probeContentType(path);

        if (contentType == null ||
            !contentType.startsWith("image/")) {

            contentType = filename.endsWith(".png")
                ? "image/png"
                : filename.endsWith(".webp")
                    ? "image/webp"
                    : "image/jpeg";
        }

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header("X-Content-Type-Options", "nosniff")
            .cacheControl(
                CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic()
            )
            .body(resource);
    }

    @DeleteMapping("/api/admin/uploads/{filename:.+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@PathVariable String filename) {
        storageService.delete(filename);
    }

    public record UploadResponse(
        String filename,
        String url,
        String contentType,
        long size
    ) {}
}
