FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS dev
WORKDIR /vsdbg

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
            unzip \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sSL https://aka.ms/getvsdbgsh \
        | bash /dev/stdin -v latest -l /vsdbg

ENV DOTNET_USE_POLLING_FILE_WATCHER 1
ENV ASPNETCORE_URLS http://*:8000
EXPOSE 8000

WORKDIR /app
CMD ["dotnet", "watch", "run", "--no-launch-profile"]