using DataTransferObjects;
using System.Collections.Generic;
namespace Services.Interfaces
{
    public interface IOptimization
    {
        List<OutputPoint> StartOptimization(Input input);
    }
}
