using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MVP
{
    public class CModel: ICircleModel
    {
        public CModel() { }

        public double getArea(double radius)
        {
            return Math.PI * radius * radius;
        }
    }
}