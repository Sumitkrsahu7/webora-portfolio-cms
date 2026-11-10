package com.portfolio.auth;

import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class LoginAttemptService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long WINDOW_MS = 15 * 60 * 1000L;
    private static final int MAX_TRACKED_EMAILS = 10000;

    private final Map<String, AttemptWindow> attempts =
        new LinkedHashMap<>();

    public synchronized long getRetryAfterSeconds(String email) {
        long now = System.currentTimeMillis();
        removeExpiredWindows(now);

        AttemptWindow window = attempts.get(email);

        if (window == null ||
            window.failedAttempts < MAX_FAILED_ATTEMPTS) {
            return 0;
        }

        long remaining =
            window.windowStart + WINDOW_MS - now;

        return Math.max(1, (remaining + 999) / 1000);
    }

    public synchronized void recordFailure(String email) {
        long now = System.currentTimeMillis();
        removeExpiredWindows(now);

        AttemptWindow window = attempts.get(email);

        if (window == null) {
            window = new AttemptWindow(now);
            attempts.put(email, window);
        }

        window.failedAttempts++;

        if (attempts.size() > MAX_TRACKED_EMAILS) {
            Iterator<String> iterator = attempts.keySet().iterator();

            if (iterator.hasNext()) {
                iterator.next();
                iterator.remove();
            }
        }
    }

    public synchronized void reset(String email) {
        attempts.remove(email);
    }

    private void removeExpiredWindows(long now) {
        Iterator<Map.Entry<String, AttemptWindow>> iterator =
            attempts.entrySet().iterator();

        while (iterator.hasNext()) {
            AttemptWindow window = iterator.next().getValue();

            if (now - window.windowStart >= WINDOW_MS) {
                iterator.remove();
            }
        }
    }

    private static class AttemptWindow {
        private final long windowStart;
        private int failedAttempts;

        private AttemptWindow(long windowStart) {
            this.windowStart = windowStart;
            this.failedAttempts = 0;
        }
    }
}
