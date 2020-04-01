using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Fleet.FuelStationsCore.Services.CollectApi
{
    public class CollectApiOptions
    {
        public string GasPriceUrl {get; set; }
        public string ApiKey {get; set;}
    }

    public class CollectApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly CollectApiOptions _options;

        public CollectApiClient(HttpClient client, IOptions<CollectApiOptions> options)
        {
            _httpClient = client;
            _options = options.Value;
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"apikey {_options.ApiKey}");
        }

        public async Task<GasPrices> GetGasPricesAsync()
        {
            GasPrices prices = null;
            try
            {
#if DEBUG
                await Task.Delay(1000);
                prices = JsonConvert.DeserializeObject<GasPrices>("{\"results\":[{\"currency\":\"euro\",\"lpg\":\"0,590\",\"diesel\":\"1,386\",\"gasoline\":\"1,410\",\"country\":\"Albania\"},{\"currency\":\"euro\",\"lpg\":\"0,068\",\"diesel\":\"0,104\",\"gasoline\":\"0,171\",\"country\":\"Algeria\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"1,061\",\"gasoline\":\"1,172\",\"country\":\"Andorra\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,905\",\"gasoline\":\"0,962\",\"country\":\"Armenia\"},{\"currency\":\"euro\",\"lpg\":\"0,779\",\"diesel\":\"1,144\",\"gasoline\":\"1,166\",\"country\":\"Austria\"},{\"currency\":\"euro\",\"lpg\":\"0,393\",\"diesel\":\"0,752\",\"gasoline\":\"0,752\",\"country\":\"Belarus\"},{\"currency\":\"euro\",\"lpg\":\"0,594\",\"diesel\":\"1,546\",\"gasoline\":\"1,549\",\"country\":\"Belgium\"},{\"currency\":\"euro\",\"lpg\":\"0,440\",\"diesel\":\"0,798\",\"gasoline\":\"0,875\",\"country\":\"Bosnia and Herzegovina\"},{\"currency\":\"euro\",\"lpg\":\"0,491\",\"diesel\":\"1,166\",\"gasoline\":\"1,140\",\"country\":\"Bulgaria\"},{\"currency\":\"euro\",\"lpg\":\"0,684\",\"diesel\":\"1,386\",\"gasoline\":\"1,408\",\"country\":\"Croatia\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"1,172\",\"gasoline\":\"1,079\",\"country\":\"Cyprus\"},{\"currency\":\"euro\",\"lpg\":\"0,568\",\"diesel\":\"1,188\",\"gasoline\":\"1,236\",\"country\":\"Czech Republic\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"1,538\",\"gasoline\":\"1,698\",\"country\":\"Denmark\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,316\",\"gasoline\":\"0,433\",\"country\":\"Egypt\"},{\"currency\":\"euro\",\"lpg\":\"0,589\",\"diesel\":\"1,369\",\"gasoline\":\"1,369\",\"country\":\"Estonia\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"1,451\",\"gasoline\":\"1,552\",\"country\":\"Finland\"},{\"currency\":\"euro\",\"lpg\":\"0,870\",\"diesel\":\"1,486\",\"gasoline\":\"1,546\",\"country\":\"France\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,610\",\"gasoline\":\"0,625\",\"country\":\"Georgia\"},{\"currency\":\"euro\",\"lpg\":\"0,669\",\"diesel\":\"1,359\",\"gasoline\":\"1,419\",\"country\":\"Germany\"},{\"currency\":\"euro\",\"lpg\":\"0,849\",\"diesel\":\"1,469\",\"gasoline\":\"1,649\",\"country\":\"Greece\"},{\"currency\":\"euro\",\"lpg\":\"0,742\",\"diesel\":\"1,242\",\"gasoline\":\"1,177\",\"country\":\"Hungary\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"1,674\",\"gasoline\":\"1,726\",\"country\":\"Iceland\"},{\"currency\":\"euro\",\"lpg\":\"0,690\",\"diesel\":\"1,314\",\"gasoline\":\"1,417\",\"country\":\"Ireland\"},{\"currency\":\"euro\",\"lpg\":\"0,796\",\"diesel\":\"2,142\",\"gasoline\":\"1,663\",\"country\":\"Israel\"},{\"currency\":\"euro\",\"lpg\":\"0,620\",\"diesel\":\"1,516\",\"gasoline\":\"1,621\",\"country\":\"Italy\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,702\",\"gasoline\":\"1,219\",\"country\":\"Jordan\"},{\"currency\":\"euro\",\"lpg\":\"0,510\",\"diesel\":\"1,000\",\"gasoline\":\"1,050\",\"country\":\"Kosovo\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,328\",\"gasoline\":\"0,194\",\"country\":\"Kuwait\"},{\"currency\":\"euro\",\"lpg\":\"0,597\",\"diesel\":\"1,199\",\"gasoline\":\"1,269\",\"country\":\"Latvia\"},{\"currency\":\"euro\",\"lpg\":\"0,877\",\"diesel\":\"1,086\",\"gasoline\":\"1,486\",\"country\":\"Lebanon\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,097\",\"gasoline\":\"0,129\",\"country\":\"Libya\"},{\"currency\":\"euro\",\"lpg\":\"0,573\",\"diesel\":\"1,125\",\"gasoline\":\"1,215\",\"country\":\"Lithuania\"},{\"currency\":\"euro\",\"lpg\":\"0,562\",\"diesel\":\"1,161\",\"gasoline\":\"1,239\",\"country\":\"Luxembourg\"},{\"currency\":\"euro\",\"lpg\":\"0,446\",\"diesel\":\"1,006\",\"gasoline\":\"1,087\",\"country\":\"Macedonia\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"1,280\",\"gasoline\":\"1,410\",\"country\":\"Malta\"},{\"currency\":\"euro\",\"lpg\":\"0,537\",\"diesel\":\"0,801\",\"gasoline\":\"0,898\",\"country\":\"Moldova\"},{\"currency\":\"euro\",\"lpg\":\"0,580\",\"diesel\":\"1,261\",\"gasoline\":\"1,310\",\"country\":\"Montenegro\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,921\",\"gasoline\":\"1,039\",\"country\":\"Morocco\"},{\"currency\":\"euro\",\"lpg\":\"0,907\",\"diesel\":\"1,489\",\"gasoline\":\"1,795\",\"country\":\"Netherlands\"},{\"currency\":\"euro\",\"lpg\":\"0,854\",\"diesel\":\"1,676\",\"gasoline\":\"1,750\",\"country\":\"Norway\"},{\"currency\":\"euro\",\"lpg\":\"0,554\",\"diesel\":\"1,185\",\"gasoline\":\"1,142\",\"country\":\"Poland\"},{\"currency\":\"euro\",\"lpg\":\"0,744\",\"diesel\":\"1,514\",\"gasoline\":\"1,614\",\"country\":\"Portugal\"},{\"currency\":\"euro\",\"lpg\":\"0,561\",\"diesel\":\"1,153\",\"gasoline\":\"1,136\",\"country\":\"Romania\"},{\"currency\":\"euro\",\"lpg\":\"0,348\",\"diesel\":\"0,684\",\"gasoline\":\"0,681\",\"country\":\"Russia\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,181\",\"gasoline\":\"0,217\",\"country\":\"Saudi Arabia\"},{\"currency\":\"euro\",\"lpg\":\"0,646\",\"diesel\":\"1,377\",\"gasoline\":\"1,275\",\"country\":\"Serbia\"},{\"currency\":\"euro\",\"lpg\":\"0,592\",\"diesel\":\"1,237\",\"gasoline\":\"1,343\",\"country\":\"Slovakia\"},{\"currency\":\"euro\",\"lpg\":\"0,674\",\"diesel\":\"1,254\",\"gasoline\":\"1,276\",\"country\":\"Slovenia\"},{\"currency\":\"euro\",\"lpg\":\"0,725\",\"diesel\":\"1,228\",\"gasoline\":\"1,292\",\"country\":\"Spain\"},{\"currency\":\"euro\",\"lpg\":\"0,854\",\"diesel\":\"1,583\",\"gasoline\":\"1,536\",\"country\":\"Sweden\"},{\"currency\":\"euro\",\"lpg\":\"0,793\",\"diesel\":\"1,437\",\"gasoline\":\"1,353\",\"country\":\"Switzerland\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,375\",\"gasoline\":\"0,503\",\"country\":\"Tunisia\"},{\"currency\":\"euro\",\"lpg\":\"0,245\",\"diesel\":\"1,006\",\"gasoline\":\"1,073\",\"country\":\"Turkey\"},{\"currency\":\"euro\",\"lpg\":\"-\",\"diesel\":\"0,698\",\"gasoline\":\"0,596\",\"country\":\"U.S.A\"},{\"currency\":\"euro\",\"lpg\":\"0,466\",\"diesel\":\"0,984\",\"gasoline\":\"1,001\",\"country\":\"Ukraine\"},{\"currency\":\"euro\",\"lpg\":\"0,729\",\"diesel\":\"1,570\",\"gasoline\":\"1,515\",\"country\":\"United Kingdom\"}],\"success\":true}");
#else
                var response = await _httpClient.GetAsync(_options.GasPriceUrl);
                response.EnsureSuccessStatusCode();
                prices = await response.Content.ReadAsAsync<GasPrices>();
#endif
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return prices;
        }
    }
}