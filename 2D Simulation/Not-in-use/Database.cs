using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

namespace DreamCareer
{
    public static class Database
    {
        public static SqlConnection GetSqlConnection()
        {
            string remote_db_string =
                "Data Source=ibmmath-3\\sqlexpress;" +
                "Initial Catalog=TestDatabase;" +
                "Integrated Security=SSPI;";

            SqlConnection connection = new SqlConnection();
            connection.ConnectionString = remote_db_string;
            connection.Open();
            return connection;
        }

        public static int CreateUser(float Bexpected, int Bactual, int Bmin)
        {
            SqlConnection connection = GetSqlConnection();

            // // Setting up the command
            // string sp_name = "insert_new_row";
            // SqlCommand insert_user = new SqlCommand(sp_name, connection);
            // insert_user.CommandType = System.Data.CommandType.StoredProcedure;
            //
            // // Adding parameters
            // insert_user.Parameters.Add(
            //     new SqlParameter("@Uname", Username));
            // insert_user.Parameters.Add(
            //     new SqlParameter("@password", Password));
            // insert_user.Parameters.Add(
            //     new SqlParameter("@salt", Salt));
            // insert_user.Parameters.Add(
            //     new SqlParameter("@email", Email));


            string sp_name = "INSERT INTO Table_1 (Bexpected, Bactual, Bmin) VALUES (2.1, 3, 1);";
            SqlCommand insert_user = new SqlCommand(sp_name, connection);
                //insert_user.CommandType = System.Data.CommandType.StoredProcedure;
            // Output parameter
            SqlParameter OutputParam =
                new SqlParameter("@ID", SqlDbType.Int);
            OutputParam.Direction = ParameterDirection.Output;
            insert_user.Parameters.Add(OutputParam);

            // Setting up a return value container
            SqlParameter ReturnVal = new SqlParameter("RetVal",
                System.Data.SqlDbType.Int);
            ReturnVal.Direction =
                System.Data.ParameterDirection.ReturnValue;
            insert_user.Parameters.Add(ReturnVal);

            // Executing the query and closing connection
            insert_user.ExecuteNonQuery();
            connection.Close();

            // checking the return value
            return (int)OutputParam.Value;
        }
    }
}
