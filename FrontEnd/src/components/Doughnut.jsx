import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import ReactEcharts from 'echarts-for-react'
import { useEffect, useState } from 'react'

export default function DoughnutChart({ height, color = [] }) {
  const theme = useTheme()
  const [payment2000, setPayment2000] = useState([])
  const [payment4000, setPayment4000] = useState([])
  const [payment6000, setPayment6000] = useState([])

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getPaymentInfo')
        const payments = response.data.data
        const payments2000 = payments.filter((payment) => payment.amount === 2000)
        const payments4000 = payments.filter((payment) => payment.amount === 4000)
        const payments6000 = payments.filter((payment) => payment.amount === 6000)

        console.log(payments.length)
        setPayment2000((payments2000.length / payments.length) * 100)
        setPayment4000((payments4000.length / payments.length) * 100)
        setPayment6000((payments6000.length / payments.length) * 100)
      } catch (error) {
        console.error('Error fetching payments:', error)
      }
    }
    fetchPayments()
  }, [])

  const option = {
    legend: {
      show: true,
      itemGap: 20,
      icon: 'circle',
      bottom: 0,
      textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: 'roboto' }
    },
    tooltip: { show: false, trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    xAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    yAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],

    series: [
      {
        name: 'Traffic Rate',
        type: 'pie',
        radius: ['45%', '72.55%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: 'center', // shows the description data to center, turn off to show in right side
            textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: 'roboto' },
            formatter: '{a}'
          },
          emphasis: {
            show: true,
            textStyle: { fontSize: '14', fontWeight: 'normal' },
            formatter: '{b} \n({d}%)'
          }
        },
        labelLine: { normal: { show: false } },
        data: [
          { value: payment2000, name: 'Subcription 2000' },
          { value: payment4000, name: 'Subcription 4000' },
          { value: payment6000, name: 'Subcription 6000' }
        ],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  }

  return <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />
}
