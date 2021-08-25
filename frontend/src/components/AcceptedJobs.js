import React from 'react';
import acceptedJobs from '../data/acceptedJobs.json';
const AcceptedJobs = ({fundWork}) => {

return (
    <table class="table">
        <thead>
            <th>Description</th>
            <th>Value</th>
            <th>Address</th>
            <th>Fund</th>
        </thead>
        <tbody>
    {
      acceptedJobs.jobs.map(job => {
            return (
                <tr>
                    <td>{job.description}</td>
                    <td>{job.value}</td>
                    <td>{job.address}</td>
                    <td>
                    <form
                        onSubmit={(event) => {
                        event.preventDefault();
                        fundWork(job.description, job.value, job.address)
                        }}
                    >
                        <div className="form-group">
                            <input className="btn btn-primary" type="submit" value="Fund" />
                        </div>
                     </form>
                    </td>
                </tr>
            )
        })}
        </tbody>
    </table>
)
}

export default AcceptedJobs
