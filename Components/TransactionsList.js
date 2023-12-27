"use client";

import { useState } from "react";

function TransactionsList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(1000 / itemHeight),
    items.length
  );
  const visibleItems = items.slice(startIndex, endIndex);
  const invisibleItemsHeight =
    (startIndex + visibleItems.length - endIndex) * itemHeight;
  const handleScroll = (event) => {
    setScrollTop(event.target.scrollTop);
  };
  return (
    <div
      className="h-full scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100"
      style={{ overflowY: "scroll" }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${items.length * itemHeight}px` }}>
        <div
          style={{
            position: "relative",
            height: `${visibleItems.length * itemHeight}px`,
            top: `${startIndex * itemHeight}px`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              className="mb-2 px-2 overflow-hidden border-teal-900"
              key={index}
              style={{
                height: `${itemHeight}px`,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: "rgb(13 148 136)",
              }}
            >
              <div
                className="w-full flex flex-row items-center text-gray-700 text-sm md:text-base dark:text-gray-300"
                style={{ height: "100%" }}
              >
                <div style={{ width: "41%" }}>
                  <h6 className="font-bold">
                    {new Date(item.addedOn).toLocaleDateString("en-Us", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h12",
                    })}
                  </h6>
                  Bal. ₹{" "}
                  {item.updatedBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  <br />
                  <span
                    className="font-bold text-yellow-500"
                    style={{ fontSize: 13 }}
                  >
                    {item.notes}
                  </span>
                </div>
                <div className="text-right" style={{ width: "15%" }}>
                  ₹{" "}
                  {(item.originalAmount - item.calculatedAmount).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}
                </div>
                <div
                  className="text-right text-green-500 font-bold"
                  style={{ width: "22%" }}
                >
                  {!item.gave
                    ? `₹ ${item.originalAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}`
                    : ""}
                </div>
                <div
                  className="text-right text-red-500 font-bold"
                  style={{ width: "22%" }}
                >
                  {item.gave
                    ? `₹ ${item.originalAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}`
                    : ""}
                </div>
              </div>
            </div>
          ))}
          <div style={{ height: 300, width: "100%" }}></div>
        </div>
        <div style={{ height: `${invisibleItemsHeight}px` }} />
      </div>
    </div>
  );
}

export default TransactionsList;
