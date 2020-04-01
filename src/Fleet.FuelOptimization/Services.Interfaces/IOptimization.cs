using Fleet.FuelOptimization.Dtos;
namespace Fleet.FuelOptimization.Services.Interfaces
{
    public interface IOptimization
    {
        OutputData Optimize(InputData input);
    }
}