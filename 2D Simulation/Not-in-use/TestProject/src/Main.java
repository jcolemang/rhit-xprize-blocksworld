import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
	
	public static void main(String[] args) {
		try {
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		 	String serverName = "ibmmath-3\\sqlexpress:1433";
		    String mydatabase = "databaseName=TestDatabase;integratedSecurity=true;";
		    String url = "jdbc:sqlserver://ibmmath-3;instanceName=sqlexpress;integratedSecurity=true;";
		 // Declare the JDBC objects.  
        Connection con = null;  
        Statement statement = null;   
        ResultSet resultSet = null;  
				try {
					con = DriverManager.getConnection(url);
					
					// Create and execute a SELECT SQL statement.  
                    String selectSql = "USE TestDatabase SELECT * from dbo.Table_1";  
                    try {
						statement = con.createStatement();
					} catch (SQLException e1) {
						e1.printStackTrace();
					}  
                    try {
						resultSet = statement.executeQuery(selectSql);
					} catch (SQLException e1) {
						e1.printStackTrace();
					}  

                    // Print results from select statement  
                    try {
						while (resultSet.next())   
						{  
						    System.out.println(resultSet.getString(2) + " "  
						        + resultSet.getString(3));  
						}
					} catch (SQLException e1) {
						e1.printStackTrace();
					}  
				} catch (SQLException e) {
					e.printStackTrace();
					
				} 
				finally {  
                    // Close the connections after the data has been handled.  
                    if (resultSet != null) try { resultSet.close(); } catch(Exception e) {}  
                    if (statement != null) try { statement.close(); } catch(Exception e) {}  
                    if (con != null) try { con.close(); } catch(Exception e) {}  
                } 
	}
}
