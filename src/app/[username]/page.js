"use client";

import {
  DarkThemeToggle,
  Toast,
  Navbar,
  Button,
  TextInput,
} from "flowbite-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { IoPersonCircle } from "react-icons/io5";
import { BiSolidExit } from "react-icons/bi";
import TransactionsList from "../../../Components/TransactionsList";
import { FaSearch } from "react-icons/fa";
import { Datepicker } from "flowbite-react";

export default function Page({ params }) {
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [totals, setTotals] = useState({});
  const [searchedAmount, setSearchedAmount] = useState("");
  const [fromDate, setFromDate] = useState(new Date(2023, 9, 1));
  const [toDate, setToDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("DelightLoginDetails");
    if (data == null) redirect("/");
    else {
      const value = JSON.parse(data);
      if (!value.alreadyLoggedIn || value.userName != params.username) {
        localStorage.removeItem("DelightLoginDetails");
        redirect("/");
      } else {
        const currentDatetime = new Date();
        const lastLoginDatetime = new Date(value.lastLoginTime);
        const timeDifference = currentDatetime - lastLoginDatetime;
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        if (minutesDifference >= 1440) {
          localStorage.removeItem("DelightLoginDetails");
          redirect("/");
        } else {
          fetchData();
        }
      }
    }
  }, []);

  const fetchData = () => {
    const value = JSON.parse(localStorage.getItem("DelightLoginDetails"));
    const req = {
      userName: value.userName,
      password: value.password,
    };
    fetch(
      "https://backend-online.onrender.com/checkUserAndGetTransactionData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.isError) {
          throw response.ErrorMessege;
        } else {
          setUserData(response.data.userData);
          setAllTransactions(response.data.allTransactions);
          setFilteredTransactions(response.data.allTransactions);
          setTotals(response.data.totals);
        }
        setIsLoading(false);
        setIsDataLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.toString());
        setShowToast(true);
        setIsLoading(false);
        setIsDataLoading(false);
      });
  };

  const performLogOut = () => {
    localStorage.removeItem("DelightLoginDetails");
    router.replace("/");
  };

  useEffect(() => {
    if (searchedAmount == null || searchedAmount == "") {
      setFilteredTransactions(allTransactions);
    } else {
      setFilteredTransactions(searchByOriginalAmount(parseInt(searchedAmount)));
    }
  }, [searchedAmount]);

  const searchByOriginalAmount = (amount) => {
    const matchingTransaction = allTransactions
      .filter((transaction) => transaction.originalAmount === amount)
      .sort((a, b) => b.addedOn - a.addedOn);
    return matchingTransaction;
  };

  const handleApplyFilter = () => {
    console.log(fromDate);
    console.log(toDate);
  };

  return (
    <>
      <div className="h-full w-full flex flex-col items-center">
        {!isLoading && (
          <Navbar fluid rounded className="w-full px-5">
            <div className="flex flex-row items-center dark:text-white">
              <IoPersonCircle size={30} />
              &nbsp; {userData.name}
              &nbsp;
              <span
                style={{
                  color:
                    userData.outStanding > 0
                      ? "rgb(239 68 68)"
                      : "rgb(34 197 94)",
                }}
              >
                {userData.outStanding > 0
                  ? `(You Will Give ₹${userData.outStanding.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      }
                    )})`
                  : `(You Will Get ₹${(
                      userData.outStanding * -1
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })})`}
              </span>
            </div>
            <div className="flex flex-row items-center dark:text-white">
              <DarkThemeToggle />
              &nbsp; &nbsp;
              <Button
                className="px-0 py-0"
                outline
                color="red"
                style={{ backgroundColor: "transparent" }}
                onClick={() => performLogOut()}
              >
                <BiSolidExit size={25} />
              </Button>
            </div>
          </Navbar>
        )}
        {isLoading && (
          <Navbar fluid rounded className="w-full px-5 py-5">
            <div className="w-full flex">
              <svg
                className="w-7 h-7 me-3 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2" />
                <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
            </div>
          </Navbar>
        )}

        {!isLoading && (
          <div class="mt-5 px-2 flex w-full flex-col md:flex-row dark:text-white">
            <div class="w-full md:w-1/3">
              <TextInput
                value={searchedAmount}
                onChange={(e) => {
                  setSearchedAmount(e.target.value);
                }}
                type="number"
                icon={FaSearch}
                placeholder="Search by amount"
              />
            </div>
            <div class="flex flex-row w-full mt-5 md:w-2/3 md:mt-0">
              <div class="basis-2/5 md:pl-2">
                <Datepicker
                  defaultDate={fromDate}
                  onSelectedDateChanged={(date) => {
                    setFromDate(date);
                  }}
                  title="From Date"
                />
              </div>
              <div class="basis-2/5 pl-2">
                <Datepicker
                  onSelectedDateChanged={(date) => {
                    setToDate(date);
                  }}
                  title="To Date"
                />
              </div>
              <div class="basis-1/5 pl-2 ">
                <Button
                  onClick={() => handleApplyFilter()}
                  className="w-full font-bold"
                  color="light"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && (
          <div
            className="text-right mt-5 px-2 w-full flex flex-row text-gray-700 dark:text-gray-300"
            style={{ fontSize: 13 }}
          >
            <div className="text-center" style={{ width: "35%" }}>
              Total Transactions
              <br />
              {allTransactions.length}
            </div>
            <div style={{ width: "21%" }}>
              Comission
              <br />
              {totals.totalComission.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
            <div style={{ width: "22%" }}>
              Received
              <br />
              {totals.totalGot.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
            <div style={{ width: "22%" }}>
              Paid
              <br />
              {totals.totalGave.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        )}

        {!isDataLoading && allTransactions.length > 0 && (
          <div style={{ maxHeight: "80%" }} className="mt-5 px-2 h-full w-full">
            <TransactionsList
              items={filteredTransactions}
              itemHeight={100}
              containerHeight={500}
            />
          </div>
        )}
        {isDataLoading && (
          <div
            role="status"
            style={{ width: "100%" }}
            className="mt-5 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
          >
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>{" "}
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>{" "}
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>{" "}
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>{" "}
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>{" "}
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>{" "}
            <div
              style={{ height: 100 }}
              className="mb-5 flex items-center justify-between"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>
          </div>
        )}
        {showToast && (
          <div style={{ position: "absolute", top: 60 }} className="w-full">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{errorMessage}</div>
              <Toast.Toggle onDismiss={() => setShowToast(false)} />
            </Toast>
          </div>
        )}
      </div>
    </>
  );
}
