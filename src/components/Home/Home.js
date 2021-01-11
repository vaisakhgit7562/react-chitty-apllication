import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { API_BASE_URL, headersConfig, ACCESS_TOKEN_NAME, ACCESS_TOKEN_START } from '../../constants/apiContants';
import Table from '../../components/Table/Table';
import schema from '../../components/Table/Schema';
import axios from 'axios';
import qs from 'qs';

function Home(props) {
  const [data, setData] = useState();
  const [state, setState] = useState({
    successMessage: null
  })

  const Pay = (amount, userId, paymentChittyId) => {
    let playload = qs.stringify({
      amount: amount,
      userId: userId,
      paymentChittyId: paymentChittyId
    });


    axios.post(API_BASE_URL + 'user/payment', playload, { headers: { 'authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
      .then(function (response) {

        if (response.data.status === 'success') {
          setState(prevState => ({
            ...prevState,
            'successMessage': 'Paid successful..'
          }))
          props.history.push('/home');
        }
        else if (response.data.status === 'error') {
          props.showError("Some error ocurred");
        }
        else {
          props.showError("Some error ocurred");
        }
      })
      .catch(function (err) {
        if (err.response) {
          props.showError(err.response.data.message);
          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          props.showError("Some error ocurred");
          // client never received a response, or request never left
        } else {
          // anything else
          props.showError("Some error ocurred");
        }
      });

  };
  useEffect(() => {
    axios.get(API_BASE_URL + 'user/me', { headers: { 'authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
      .then(function (response) {
        console.log(response.data.data);
        let items = [];
        response.data.data.forEach((item, index) => {
          items.push({
            "S.No": index + 1,
            'Chitty No': item.chitty_no,
            'Issue Date': item.issue_date,
            'Due Date': item.due_date,
            'Amount': item.amount,
            'Pay': <button onClick={() => Pay(item.amount, item.user_id, item.paymentChittyId)}>Pay</button>
          });
        })
        setData(items);
        if (response.status !== 200) {
          redirectToLogin();
        }
      }).catch(function (error) {
        //redirectToLogin();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function redirectToLogin() {
    props.history.push('/login');
  }
  return (
    <div className="container p-2">
      <div className="row">
        <div className="col">
          <Table headers={Object.keys(schema.Payment)} rows={data} />
        </div>
      </div>
      <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
        {state.successMessage}
      </div>
    </div>
  )
}

export default withRouter(Home);