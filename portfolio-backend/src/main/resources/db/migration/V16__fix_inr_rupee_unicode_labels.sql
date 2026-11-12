-- V16: Repair INR price labels using the Unicode rupee character.
-- Match only a literal question mark immediately before a digit.

UPDATE dbo.pricing_packages
SET
    price_label = REPLACE(price_label, N'?', NCHAR(0x20B9)),
    updated_at = TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')
WHERE price_label LIKE N'%~?[0-9]%' ESCAPE N'~';

UPDATE dbo.services
SET
    starting_price_label = REPLACE(starting_price_label, N'?', NCHAR(0x20B9)),
    updated_at = TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')
WHERE starting_price_label LIKE N'%~?[0-9]%' ESCAPE N'~';
GO