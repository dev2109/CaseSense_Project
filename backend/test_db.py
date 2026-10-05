import pyodbc

try:
    conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=INJ-IN-LAP-185\\SQL22;DATABASE=CaseSense;Trusted_Connection=yes;')
    print("Connection successful!")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
