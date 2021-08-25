import React from "react";


export function LatestContract({latestContractDescription, latestContractValue}) {
  return (
      <>
        <h4>Details of the latest contract on blockchain</h4>
        <div>
        {`Latest Contract Description: ${latestContractDescription}`}
        </div>
        <div>
        {`Latest Contract Value: ${latestContractValue}`}
        </div>
    </>
  );
}