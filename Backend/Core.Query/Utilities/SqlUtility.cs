
using EPiServer.Core;
using EPiServer.ServiceLocation;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Platform.Models;
using Platform.Models.ImportJob;
using Platform.Models.Services.Abstract;

namespace Core.Querying.Utilities
{
    public class ImportJobState
    {
        private static readonly IEluxCache CacheService = ServiceLocator.Current.GetInstance<IEluxCache>();

        private static string ConnectionString
        {
            get
            {
                return System.Configuration.ConfigurationManager.ConnectionStrings["EPiServerDB"].ConnectionString;
            }
        }
        private static void CloseConnection(SqlConnection connection)
        {
            try
            {
                if (connection != null && connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }
            }
            catch { }
        }
        private static bool IsExistData(string query)
        {
            var connection = new SqlConnection(ConnectionString);
            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    var result = command.ExecuteScalar();
                    if (result != null && int.Parse(result.ToString()) > 0)
                        return true;
                }

                CloseConnection(connection);

                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                CloseConnection(connection);
            }
        }
        private static DataTable FetchData(string query)
        {
            var connection = new SqlConnection(ConnectionString);
            var dt = new DataTable();
            try
            {
                connection.Open();
                var adapter = new SqlDataAdapter(query, connection);
                adapter.Fill(dt);
                adapter.Dispose();
                CloseConnection(connection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                CloseConnection(connection);
            }

            return dt;
        }
        private static int InsertUpdateData(string query)
        {
            var rowsAffected = -1;
            var connection = new SqlConnection(ConnectionString);

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    rowsAffected = command.ExecuteNonQuery();
                }

                CloseConnection(connection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                CloseConnection(connection);
            }

            return rowsAffected;
        }
        public static bool IsImportJobRunning
        {
            get
            {
                try
                {
                    var cacheKey = $"{Constant.Cache.ImportJobState}";

                    var datacache = CacheService.Get<bool?>(cacheKey);
                    if (datacache != null)
                        return (bool)datacache;

                    var queryselect = "select count(*) from tblScheduledItem ";
                    var list = new List<string>();
                    for (var i = 0; i < Constant.ImportJob.SyncProductJobs.Length; i++)
                    {
                        list.Add($"'{Constant.ImportJob.SyncProductJobs[i]}'");
                    }
                    var inParams = string.Join(",", list);
                    var querywhere = $"where Name in ({inParams}) and IsRunning = 1";
                    var query = queryselect + querywhere;

                    var isExist = IsExistData(query);

                    CacheService.Add(cacheKey, isExist, Constant.DefaultTimeSpan15Second, new List<ContentReference>() { }, new List<string>() { Constant.DefaultMasterKey });

                    return isExist;
                }
                catch
                {
                    return false;
                }
            }
        }

        public static List<ImportJobStateModel> GetAllImportJobs()
        {
            try
            {
                var importJobs = new List<ImportJobStateModel>();
                var queryselect = "select pkID, Name, IsRunning, LastExec, LastPing from tblScheduledItem ";
                var list = new List<string>();
                for (var i = 0; i < Constant.ImportJob.SyncProductJobs.Length; i++)
                {
                    list.Add($"'{Constant.ImportJob.SyncProductJobs[i]}'");
                }
                var inParams = string.Join(",", list);
                var querywhere = $"where Name in ({inParams})";
                var query = queryselect + querywhere;

                var results = FetchData(query);
                foreach (DataRow reader in results.Rows)
                {
                    var name = reader["Name"];
                    var pkID = reader["pkID"];
                    var lastExec = reader["LastExec"];
                    var lastPing = reader["LastPing"];
                    var isRunning = reader["IsRunning"];

                    var model = new ImportJobStateModel 
                    {
                        Id = new Guid(pkID.ToString()),
                        Name = name.ToString(),
                        IsRunning = (bool)isRunning,
                        LastExec = (DateTime)lastExec,
                        LastPing = (DateTime)lastPing,
                    };

                    if(model.IsRunning && model.LastPing.Subtract(DateTime.Now).TotalHours > 3)
                    {
                        model.IsWarnning = true;
                    }
                    else
                    {
                        model.IsWarnning = false;
                    }

                    importJobs.Add(model);
                }

                return importJobs;
            }
            catch
            {
                return new List<ImportJobStateModel>();
            }
        }

        public static void Stop(string id)
        {
            var query = $"update tblScheduledItem set IsRunning = 0 where pkID = '{id}'";
            InsertUpdateData(query);
        }
    }
}
