import d3 from 'd3'

const ENDPOINT = 'http://54.213.83.132/hackoregon/http/current_candidate_transactions_out'
export const transactions = filerId => `${ENDPOINT}/${filerId}/`

export const getData = (filerId, url) => new Promise((res,rej) => {
    d3.json(url(filerId) , (err,data) => {
      if(err) {
        rej('failed at promise',err)
      }
      res(data)
    })
  })
