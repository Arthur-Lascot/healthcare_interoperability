
import pandas as pd
import matplotlib.pyplot as plt
print("Libraries imported successfully.")

def xlsx_to_df(file_path):
    """Reads an Excel file and returns a pandas DataFrame."""
    df = pd.read_excel(file_path)
    return df

def plot_df(df, x_col, y_col):
    """Plots the specified columns of the DataFrame."""
    plt.figure(figsize=(10, 6))
    plt.plot(df[x_col], df[y_col], marker='o')
    plt.title(f'{y_col} vs {x_col}')
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.grid(True)
    plt.show()

def main():
    print("Starting the Excel to DataFrame conversion...")
    file_path = 'ressource/matrice.xlsx'  # Path to your Excel file
    df = xlsx_to_df(file_path)
    
    # Display the first few rows of the DataFrame
    print(df.head(15))
    with open('output.txt', 'w') as f:
        f.write(df.head().to_string())

main()