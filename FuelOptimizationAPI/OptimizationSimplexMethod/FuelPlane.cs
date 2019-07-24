namespace OptimizationSimplexMethod
{
    public class FuelPlan
    {
        double[] costs;//ціна палива в і-й країні
        int[] volumes;//об'єм палива, що потрібен для доїзду від країни і до кордону країни i+1
        int tank;//об'єм баку автовоза
        public double[,] Table
        {
            get
            {
                int points_number = costs.Length;
                double[,] table = new double[2 * points_number + 1, points_number + 1];
                table[0, 0] = -volumes[0];
                table[0, 1] = -1;
                for (int i = 1; i < points_number; i++)
                {
                    table[i, 0] = table[i - 1, 0] - volumes[i];
                    for (int j = 1; j <= i + 1; j++)
                    {
                        table[i, j] = -1;
                    }
                }
                table[points_number, 0] = tank;
                table[points_number, 1] = 1;
                for (int i = points_number + 1; i < 2 * points_number; i++)
                {
                    table[i, 0] = table[i - 1, 0] + volumes[i - points_number - 1];
                    for (int j = 1; j <= i + 1 - points_number; j++)
                    {
                        table[i, j] = 1;
                    }
                }
                for (int j = 0; j < points_number; j++)
                {
                    table[2 * points_number, j + 1] = costs[j];
                }
                return table;
            }
        }//вхідні дані для симплекс-таблиці (обмеження, цільова функція)

        public double[] Plan//об'єм купленого палива в і-й країні
        {
            get
            {
                int points_number = costs.Length;
                double[] result = new double[points_number];
                double[,] table_result;
                Simplex S = new Simplex(Table);
                table_result = S.Calculate(result);
                return result;
            }
        }

        public FuelPlan()
        {
            costs = new double[] { 31 };
            tank = 600;
            volumes = new int[] { 0 };
        }

        public FuelPlan(double[] Costs, int[] Volumes, int Tank)
        {
            costs = Costs;
            tank = Tank;
            volumes = Volumes;
        }
    }

      
    }
