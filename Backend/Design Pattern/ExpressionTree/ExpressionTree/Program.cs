using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionTree
{
    static class Program
    {
        static void Main(string[] args)
        {
            IQueryable<Product> qry = new List<Product>()
            {
                new Product() {Name = "Ball", Category = "Sport"},
                new Product() {Name = "Bag", Category = "Other"},
                new Product() {Name = "Sport bag", Category = "Sport"},
            }.AsQueryable();

            var result = qry.ApplyFilter(p => p.Category.ToString(), "Sport");
        }

        public static IQueryable<T> ApplyFilter<T>(this IQueryable<T> qry, Expression<Func<T, string>> field, string likeFilter)
        {
            var member = field.Body as MemberExpression;
            var propInfo = member.Member as PropertyInfo;

            var param = Expression.Parameter(typeof(T), "x");
            var prop = Expression.Property(param, propInfo);

            var containsMethod = typeof(string).GetMethod("Contains");
            var body = Expression.Call(prop, containsMethod, Expression.Constant(likeFilter));
            var expr = Expression.Lambda<Func<T, bool>>(body, param);

            return qry.Where(expr);
        }
    }

    public class Product
    {
        public string Name;
        public string Category;
    }
}
