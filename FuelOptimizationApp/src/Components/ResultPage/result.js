import React from 'react'
const output = [
    { "Coordinates": [1.0, 2.0], "UnloadCars": null, "FuelCost": 1.0, "FuelVolume": 630 },
    { "Coordinates": [1.0, 2.0], "UnloadCars": [{ "BrandId": 1, "ModelId": 1 },
    { "BrandId": 1, "ModelId": 2 }, { "BrandId": 2, "ModelId": 3 }], "FuelCost": null, "FuelVolume": null },
    { "Coordinates": [1.0, 2.0], "UnloadCars": null, "FuelCost": 0.94, "FuelVolume": 370 }];


class Result extends React.Component {
    

    calculateRoute = () =>
    {
      
    }

    render() {
        return (
            <div>
                Result
        </div>
        );
    }
}

export default Result;