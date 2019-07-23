using Services.Interfaces;
using DataTransferObjects;
using OptimizationSimplexMethod;
using System.Linq;

namespace Services
{
    class Optimization : IOptimization
    {
        readonly IdbData _dbData;
        public Optimization(IdbData dbData)
        {
            _dbData = dbData;
        }

        public void StartOptimization(Input input)
        {
            int[] volumes = new int[] { 300, 200, 300 };
            double[] costs = new double[] { 1, 1.25, 0.95 };

            int tank = _dbData.GetTrucks().Find(truck => truck.Id == input.TruckId).TankCapacity;


            FuelPlane P = new FuelPlane(costs, volumes, tank);
        }
        private void CalcVolume()
        {

        }
    }
}
