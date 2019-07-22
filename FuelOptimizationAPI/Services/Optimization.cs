using Services.Interfaces;
using DataTransferObjects;
using OptimizationSimplexMethod;

namespace Services
{
    class Optimization : IOptimization
    {
        public void StartOptimization(Input input)
        {
            int[] volumes = new int[] { 300, 200, 300 };
            double[] costs = new double[] { 1, 1.25, 0.95 };
            
            int tank = 600;
            FuelPlane P = new FuelPlane(costs, volumes, tank);
        }
    }
}
