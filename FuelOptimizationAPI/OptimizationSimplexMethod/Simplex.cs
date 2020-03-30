using System.Collections.Generic;
using Accord.Math;

namespace OptimizationSimplexMethod
{
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
                    // if ((table[i, mainCol] > 0.00001) && ((table[i, 0] / table[i, mainCol]) - (table[mainRow, 0] / table[mainRow, mainCol]) <0.0001))

                    mainRow = i;

            return mainRow;
        }
    }
}
