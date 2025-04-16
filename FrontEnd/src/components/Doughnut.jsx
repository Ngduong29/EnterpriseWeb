import { useTheme } from '@mui/material/styles'
import ReactEcharts from 'echarts-for-react'
import { useEffect, useState } from 'react'

export default function DoughnutChart({ height, color = [], paymentList = [] }) {
  const theme = useTheme()
  const payment500 = paymentList.filter((payment) => payment.amount <= 500000).length
  const payment1000 = paymentList.filter((payment) => payment.amount <= 1000000 && payment.amount > 500000).length
  const payment2000 = paymentList.filter((payment) => payment.amount <= 2000000 && payment.amount > 1000000).length

  const option = {
    legend: {
      show: true,
      itemGap: 20,
      icon: 'circle',
      bottom: 0,
      textStyle: {
        color: theme.palette.text.secondary,
        fontSize: 13,
        fontFamily: 'roboto'
      }
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Subscription Range',
        type: 'pie',
        radius: ['45%', '72.55%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          show: false,
          position: 'center',
          textStyle: {
            color: theme.palette.text.secondary,
            fontSize: 13,
            fontFamily: 'roboto'
          },
          formatter: '{a}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'normal',
            formatter: '{b} \n({d}%)'
          }
        },
        labelLine: { show: false },
        data: [
          { value: payment500, name: '≤ 500.000₫' },
          { value: payment1000, name: '500.000₫ - 1.000.000₫' },
          { value: payment2000, name: '1.000.000₫ - 2.000.000₫' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  return <ReactEcharts style={{ height }} option={{ ...option, color }} notMerge={true} lazyUpdate={true} />
}
