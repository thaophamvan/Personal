using System;
using System.Collections.Generic;
using System.Text;

namespace MVCSharp.Examples.TasksInteraction.Model
{
    public class Employee
    {
        private readonly string name;
        private readonly decimal baseSalary;
        private decimal bonusSum;

        public static readonly List<Employee>  AllInstances = new List<Employee>();

        public Employee(string name, decimal baseSalary)
        {
            this.name = name;
            this.baseSalary = baseSalary;
        }

        public string Name
        {
            get { return name; }
        }

        public decimal BaseSalary
        {
            get { return baseSalary; }
        }

        public decimal BonusSum
        {
            get { return bonusSum; }
        }

        public decimal TotalPay
        {
            get { return baseSalary + bonusSum; }
        }

        public void SetBonusSum(decimal s)
        {
            bonusSum = s;
        }
    }
}
