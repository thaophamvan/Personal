﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PI.Bussines
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class PIFOR_DatabaseEntities : DbContext
    {
        public PIFOR_DatabaseEntities()
            : base("name=PIFOR_DatabaseEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<TCapBac> TCapBacs { get; set; }
        public virtual DbSet<TChucVu> TChucVus { get; set; }
        public virtual DbSet<THinhThucTruc> THinhThucTrucs { get; set; }
        public virtual DbSet<TDanhSachTrucBan> TDanhSachTrucBans { get; set; }
        public virtual DbSet<TDonVi> TDonVis { get; set; }
        public virtual DbSet<TLichLamViec> TLichLamViecs { get; set; }
        public virtual DbSet<TThongTinLichLamViec> TThongTinLichLamViecs { get; set; }
        public virtual DbSet<TThongTinLichTruc> TThongTinLichTrucs { get; set; }
    }
}