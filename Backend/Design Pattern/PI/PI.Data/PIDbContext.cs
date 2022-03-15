using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Reflection;
using PI.Core.Models;
using PI.Data.Interface;

namespace PI.Data
{
    public class PiDbContext:DbContext,IDataContext
    {
        public PiDbContext()
            : base("name=PIFOR_Database")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<DonVi> DonVi { get; set; }
        public DbSet<ChucVu> ChucVu { get; set; }
        public DbSet<CapBac> CapBac { get; set; }
        public DbSet<HinhThucTruc> HinhThucTruc { get; set; }
        public DbSet<TrucBan> TrucBan { get; set; }
        public DbSet<DonViTruc> DonViTruc { get; set; }
        public DbSet<LichLamViec> LichLamViec { get; set; }
        public DbSet<User> User { get; set; }
        public IDbSet<T> DbSet<T>() where T : class
        {
            return this.Set<T>();
        }

        public DbEntityEntry<T> EntryGet<T>(T entity) where T : class
        {
            return this.Entry<T>(entity);
        }

        public virtual int Commit()
        {
            try
            {
                return this.SaveChanges();
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            
        }
    }
}
