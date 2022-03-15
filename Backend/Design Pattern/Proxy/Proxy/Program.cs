using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proxy
{
    class Program
    {
        static void Main(string[] args)
        {
            ICar car = new ProxyCar(new Driver(16));
            car.MoveCar();

            car = new ProxyCar(new Driver(25));
            car.MoveCar();
        }
    }
    interface ICar
    {
         void MoveCar();
    }

    //The proxy
    class ProxyCar : ICar
    {
        private Driver driver;
        private ICar realCar;
        public ProxyCar(Driver driver)
        {
            this.driver = driver;
            realCar = new Car();
        }
        public void MoveCar()
        {
            if (driver.Age <= 16)
                Console.WriteLine("Sorry the driver is too young to drive");
            else
                realCar.MoveCar();
        }
    }

    //the real object
    class Car : ICar
    {
        public void MoveCar()
        {
            Console.WriteLine("Car has been driven");
        }
    }

    class Driver
    {
        private int age;

        public int Age
        {
            get { return age; }
            set { age = value; }
        }

        public Driver(int age)
        {
            this.age = age;
        }
    }
}
