import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async (url, setter) => {
        try {
            const response = await axios.get(url);
            setter(response.data);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const addData = async (url, data) => {
        try {
            const response = await axios.post(url, data);
            // Atualize os dados localmente apenas se a operação for bem-sucedida no servidor
            if (response.status === 200) {
                fetchData(`${BASE_URL}get-${data.type}s`, data.type === 'income' ? setIncomes : setExpenses);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const deleteData = async (url, setter) => {
        try {
            const response = await axios.delete(url);
            // Atualize os dados localmente apenas se a operação for bem-sucedida no servidor
            if (response.status === 200) {
                const dataUrl = `${BASE_URL}get-${setter === setIncomes ? 'incomes' : 'expenses'}`;
                fetchData(dataUrl, setter);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };
    

    const total = items => items.reduce((total, item) => total + item.amount, 0);

    const totalBalance = () => total(incomes) - total(expenses);

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome: data => addData(`${BASE_URL}add-income`, data),
            getIncomes: () => fetchData(`${BASE_URL}get-incomes`, setIncomes),
            incomes,
            deleteIncome: id => deleteData(`${BASE_URL}delete-income/${id}`, setIncomes),
            expenses,
            totalIncome: () => total(incomes),
            addExpense: data => addData(`${BASE_URL}add-expense`, data),
            getExpenses: () => fetchData(`${BASE_URL}get-expenses`, setExpenses),
            deleteExpense: id => deleteData(`${BASE_URL}delete-expense/${id}`, setExpenses),
            totalExpenses: () => total(expenses),
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
