FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY Fleet.FuelOptimization.csproj .
RUN dotnet restore

# copy everything else and build app
COPY . .
RUN dotnet publish -c Release -o dist


FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS runtime
WORKDIR /app
COPY --from=build /app/dist .
ENV ASPNETCORE_URLS http://*:8000
EXPOSE 8000
CMD ["dotnet", "Fleet.FuelOptimization.dll"]