
import pandas as pd
import matplotlib.pyplot as plt
print("Libraries imported successfully.")

def xlsx_to_df(file_path):
    """Reads an Excel file and returns a pandas DataFrame."""
    df = pd.read_excel(file_path)
    return df
def clean_df(df):
    """Cleans the DataFrame by removing columns with any missing values."""
    df_cleaned = df.drop('Unnamed: 1', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 3', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 5', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 6', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 8', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 10', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 12', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 14', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 16', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 18', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 20', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 22', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 24', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 26', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 28', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 30', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 32', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 34', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 38', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 40', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 42', axis=1, inplace=True, errors='ignore')
    df_cleaned = df.drop('Unnamed: 44', axis=1, inplace=True, errors='ignore')
    return df_cleaned

def replace_NA_with_o_string(df):
    """Replaces all NA values in the DataFrame with empty strings."""
    df.fillna('o', inplace=True)
    return df


def main():
    print("Starting the Excel to DataFrame conversion...")
    file_path = 'ressource/matrice.xlsx'  # Path to your Excel file
    df = xlsx_to_df(file_path)
    clean_df(df)
    replace_NA_with_o_string(df)

    print(df.head(15))
    with open('output.txt', 'w') as f:
        f.write(df.head(15).to_string())

main()