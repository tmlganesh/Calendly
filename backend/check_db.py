from database import get_db_connection

conn = get_db_connection()
cursor = conn.cursor()

# Check events table columns in detail
cursor.execute("""
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_name = 'events'
    ORDER BY ordinal_position
""")
print("=== EVENTS TABLE SCHEMA ===")
for row in cursor.fetchall():
    print(f"  {row['column_name']}: {row['data_type']} (nullable: {row['is_nullable']}, default: {row.get('column_default', 'N/A')})")

conn.close()
