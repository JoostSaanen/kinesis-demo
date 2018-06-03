CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (ticker_symbol VARCHAR(4), ticker_symbol_count INTEGER);
CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "DESTINATION_SQL_STREAM"
SELECT STREAM QUADRANT, COUNT(*) OVER TEN_SECOND_SLIDING_WINDOW AS ticker_symbol_count
FROM "SOURCE_SQL_STREAM_001" WINDOW TEN_SECOND_SLIDING_WINDOW AS (PARTITION BY quadrant RANGE INTERVAL '10' SECOND PRECEDING);