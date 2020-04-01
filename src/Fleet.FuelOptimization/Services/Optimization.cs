using Fleet.FuelOptimization.Dtos;
using Fleet.FuelOptimization.Services.Interfaces;
using Accord.Math;
using System.Collections.Generic;

namespace Fleet.FuelOptimization.Services
{
    public class Optimization : IOptimization
    {

        double[] costs;//ціна палива в і-й країні
        double[] volumes;//об'єм палива, що потрібен для доїзду від країни і до кордону країни i+1
        int tank;//об'єм баку автовоза - обов'язковий залишок
        int remainder;//залишок палива на початок маршруту
        int minimum_remainder;//мінімальний залишок палива у баку
        public double[,] Table
        {
            get
            {
                int points_number = costs.Length;
                double[,] table = new double[2 * points_number + 1, points_number + 1];
                table[0, 0] = -volumes[0] - minimum_remainder + remainder;
                table[0, 1] = -1;
                for (int i = 1; i < points_number; i++)
                {
                    table[i, 0] = table[i - 1, 0] - volumes[i];
                    for (int j = 1; j <= i + 1; j++)
                    {
                        table[i, j] = -1;
                    }
                }
                table[points_number, 0] = tank - remainder + minimum_remainder;
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
        }//вхідні дані для симплекс-таблиці (обмеження, цільова функція) з урахуванням залишку на початок і мінімального необхідного залишку
        public double[] Plan()//об'єм купленого палива в і-й країні
        {
            int points_number = costs.Length;
            double[] result = new double[points_number];
            double[,] table_result;
            Simplex S = new Simplex(Table);
            table_result = S.Calculate(result);
            //return result;
            return Simplify1(result);
        }
        public void Init(double[] Costs, double[] Volumes, int Tank, int Remainder)
        {
            remainder = Remainder;
            costs = Costs;
            tank = Tank;
            volumes = Volumes;
        }
        double[] VolumeRemainders(double[] plane)
        {
            int n = plane.Length;
            double[] volumeRemainders = new double[n];
            volumeRemainders[0] = remainder;
            for (int i = 1; i < n; i++)
            {
                volumeRemainders[i] = volumeRemainders[i - 1] - volumes[i] + plane[i - 1];
            }

            return volumeRemainders;
        }

        double[] Simplify1(double[] plane)
        {

            int n = plane.Length;
            double[] simple = new double[n];
            double[] volumeremainders = new double[n];//кількість палива в баку у точці і
            volumeremainders[0] = remainder + plane[0];
            for (int i = 1; i < n; i++)
            {
                volumeremainders[i] = volumeremainders[i - 1] + plane[i] - volumes[i - 1];
                //Console.WriteLine($"vr = {volumeremainders[i]} vol = {volumes[i]}");
            }
            for (int i = 0; i < n; i++)
            {
                simple[i] = plane[i];
            }
            for (int j = 0; j < n - 1; j++)
            {
                if (costs[j] == costs[j + 1] /*&& volumeremainders[j + 1] + simple[j] <= tank */&&
                    volumeremainders[j] - simple[j] > volumes[j] + minimum_remainder)
                {
                    simple[j + 1] += simple[j];
                    simple[j] = 0;
                }
            }
            return simple;
        }

        public class Simplex
        {
            //source - симплекс таблица без базисных переменных
            public double[,] table; //симплекс таблица

            int m, n;

            List<int> basis; //список базисных переменных

            public Simplex(double[,] source)
            {
                m = source.GetLength(0);
                n = source.GetLength(1);
                double[,] temp = new double[m, n + m - 1];
                basis = new List<int>();

                for (int i = 0; i < m; i++)
                {
                    for (int j = 0; j < temp.GetLength(1); j++)
                    {
                        if (j < n)
                            temp[i, j] = source[i, j];
                        else
                            temp[i, j] = 0;
                    }
                    //выставляем коэффициент 1 перед базисной переменной в строке
                    if ((n + i) < temp.GetLength(1))
                    {
                        temp[i, n + i] = 1;
                        basis.Add(n + i);
                    }
                }

                n = temp.GetLength(1);
                table = Standardization(temp);
            }

            //приведення симплекс таблиці до стандартного вигляду

            double[,] Standardization(double[,] M)
            {
                double[,] StandardSours = Matrix.Copy(M);
                int changeVarRow = findMainNegativeRow(StandardSours);
                int changeVarCol;
                while (changeVarRow != -1)
                {
                    changeVarCol = findMainNegativeCol(changeVarRow, StandardSours);
                    basis[changeVarRow] = changeVarCol;
                    StandardSours = RewriteSimplexTable(changeVarRow, changeVarCol, StandardSours);
                    changeVarRow = findMainNegativeRow(StandardSours);
                }
                return StandardSours;
            }
            private int findMainNegativeRow(double[,] M)
            {
                int mainRow = 0;
                int rows = M.GetLength(0);
                for (int i = 1; i < rows - 2; i++)
                    if (M[mainRow, 0] > M[i, 0])
                    {
                        mainRow = i;
                    }
                if (M[mainRow, 0] >= 0) return -1;
                return mainRow;
            }
            private int findMainNegativeCol(int row, double[,] M)
            {
                int mainCol = 1;
                int col = M.GetLength(1);
                for (int i = 2; i < col; i++)
                    if (M[row, mainCol] > M[row, i])
                        mainCol = i;
                if (M[row, mainCol] > 0) return -1;
                return mainCol;
            }
            public double[,] RewriteSimplexTable(int row, int col, double[,] M)
            {
                int M_rows = M.GetLength(0);
                int M_col = M.GetLength(1);
                double temp1 = 0;
                for (int i = 0; i < M_col; i++)
                {
                    if (i != col)
                    {
                        temp1 = M[row, i] / M[row, col];
                        M[row, i] = temp1;
                    }
                }
                M[row, col] = 1;
                double temp = 0;
                for (int i = 0; i < M_rows; i++)
                {
                    if (i != row)
                    {
                        for (int j = 0; j < M_col; j++)
                            if (j != col)
                            {
                                temp = M[i, j] - M[row, j] * M[i, col];
                                M[i, j] = temp;
                            }
                        M[i, col] = 0;
                    }
                }
                return M;
            }

            //result - в этот массив будут записаны полученные значения X
            public double[,] Calculate(double[] result)
            {
                int mainCol, mainRow; //ведущие столбец и строка

                while (!IsItEnd())
                {
                    mainCol = findMainCol();
                    mainRow = findMainRow(mainCol);
                    basis[mainRow] = mainCol;

                    double[,] new_table = new double[m, n];

                    for (int j = 0; j < n; j++)
                        new_table[mainRow, j] = table[mainRow, j] / table[mainRow, mainCol];

                    for (int i = 0; i < m; i++)
                    {
                        if (i == mainRow)
                            continue;

                        for (int j = 0; j < n; j++)
                            new_table[i, j] = table[i, j] - table[i, mainCol] * new_table[mainRow, j];
                    }
                    table = new_table;
                }

                //заносим в result найденные значения X
                for (int i = 0; i < result.Length; i++)
                {
                    int k = basis.IndexOf(i + 1);
                    if (k != -1)
                        result[i] = table[k, 0];
                    else
                        result[i] = 0;
                }

                return table;
            }

            private bool IsItEnd()
            {
                bool flag = true;

                for (int j = 1; j < n; j++)
                {
                    if (table[m - 1, j] < 0)
                    {
                        flag = false;
                        break;
                    }
                }

                return flag;
            }

            private int findMainCol()
            {
                int mainCol = 1;

                for (int j = 2; j < n; j++)
                    if (table[m - 1, j] < table[m - 1, mainCol])
                        mainCol = j;

                return mainCol;
            }

            private int findMainRow(int mainCol)
            {
                int mainRow = 0;

                for (int i = 0; i < m - 1; i++)
                    if (table[i, mainCol] > 0)
                    {
                        mainRow = i;
                        break;
                    }

                for (int i = mainRow + 1; i < m - 1; i++)
                    if ((table[i, mainCol] > 0) && ((table[i, 0] / table[i, mainCol]) < (table[mainRow, 0] / table[mainRow, mainCol])))
                        mainRow = i;

                return mainRow;
            }
        }
        public OutputData Optimize(InputData data)
        {
            Init(data.Costs, data.Volumes, data.Tank, data.Remainder);
            OutputData res = new OutputData();
            res.Refuels = Plan();
            res.Remainders = VolumeRemainders(res.Refuels);
            return res;
        }
    }
}