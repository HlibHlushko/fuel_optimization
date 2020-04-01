
### **to retrieve trips by driver**

`GET http://localhost:8004/trip?driverId=<your_driver_id>`

you can get driver id from user profile

result is list of trips

trip is described with:

- Id
- DriverId
- ResidualFuel
- Truck :
  - Id
  - TractorModel
  - TractorId
  - TractorStateNumberOrVin
  - TrailerModel
  - TrailerId
  - TrailerStateNumberOrVin
  - Driver
  - DriverId
- InputPoints - _**List of points**_ - points, which were entered by user, type can be only loadUnload or visit
- OptimizedPoints - _**List of points**_ - points, which are "optimized" contained user points and fuelStations

Point described with:
  
- Id
- Latitude
- Longitude
- Label
- Type
- ? Load
- ? Unload
- ? Refuel

Possible types:

- LoadUnload = 0 - _(if type == 0 point contains Load and Unload values, if one of value is 0 that means no loading or unloading at this point   )_
- Visit = 1  _(if type == 1, we build route through it and show marker)_
- FuelStation = 2 _(if type == 2, point contains Refuel value)_
- Unseen = 3 _(if type == 3, we build route throug this point, but don't display any marker)_

Data example:

```
[
    {
        "id": 1,
        "driverId": 9,
        "truck": {
            "id": 1005,
            "tractorModel": "Lohr 2.53",
            "tractorId": 984,
            "tractorStateNumberOrVin": "LI1235DA",
            "trailerModel": "Lohr 1.21",
            "trailerId": 123,
            "trailerStateNumberOrVin": "OL1488EH",
            "driver": "Glib Hlushfo",
            "driverId": 9
        },
        "residualFuel": 120,
        "inputPoints": [
            {
                "id": 1,
                "latitude": 50.363456,
                "longitude": 30.448254,
                "label": "Київ, Теремки",
                "type": 0,
                "load": 1000,
                "unload": null,
                "refuel": null
            },
            {
                "id": 2,
                "latitude": 49.498765,
                "longitude": 27.435423,
                "label": "Хмельницька область",
                "type": 1,
                "load": null,
                "unload": null,
                "refuel": 300
            },
            {
                "id": 3,
                "latitude": 49.27444,
                "longitude": 23.872246,
                "label": "Стрий",
                "type": 0,
                "load": null,
                "unload": 1000,
                "refuel": null
            }
        ],
        "optimizedPoints": []
    },
    {
        "id": 4,
        "driverId": 9,
        "truck": {
            "id": 1005,
            "tractorModel": "Lohr 2.53",
            "tractorId": 984,
            "tractorStateNumberOrVin": "LI1235DA",
            "trailerModel": "Lohr 1.21",
            "trailerId": 123,
            "trailerStateNumberOrVin": "OL1488EH",
            "driver": "Glib Hlushfo",
            "driverId": 9
        },
        "residualFuel": 345,
        "inputPoints": [
            {
                "id": 6,
                "latitude": 51.4195,
                "longitude": 26.1407,
                "label": "Україна, Володимирецький район, Володимирець",
                "type": 0,
                "load": 123,
                "unload": 22,
                "refuel": null
            },
            {
                "id": 7,
                "latitude": 49.10778,
                "longitude": 33.44706,
                "label": "Україна, Кременчук, Кременчук",
                "type": 0,
                "load": 123,
                "unload": 222,
                "refuel": null
            }
        ],
        "optimizedPoints": []
    }
]
```
