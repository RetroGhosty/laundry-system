import React, { useEffect, useState } from 'react'
import CustomerDashboardTemplate from './CustomerDashboardTemplate'
import { Separator } from '@/shadcn/ui/separator'
import { MdOutlineNotificationsActive } from "react-icons/md";
import { format, formatDistance, isSameDay, parse } from 'date-fns';
import { Step, Stepper } from 'react-form-stepper';
import { Order, PageProps } from '@/types';
import DataTable from '@/Components/DataTable';
import { Button } from '@/shadcn/ui/button';
import { CaretSortIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import CustomerReservationAddons from '@/Components/CustomerPartials/CustomerReservationAddons';
import { FaHouse } from "react-icons/fa6";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert"
import { router } from '@inertiajs/react';


export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "updated_at",
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )},
    size: 0,
    cell: ({ row }: any) => {

      return <div className='flex flex-col items-start'>
        <div>
          {
            formatDistance(row.getValue("updated_at"), new Date(), { addSuffix: true })
          }
        </div>
      </div>
    },
  },
  {
    accessorKey: "reserved_at",
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reserved At
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )},
    cell: ({ row }) => {
      return <div className='flex flex-col items-start'>
        <div>
          {format(row.getValue("reserved_at"), 'MMM dd yyyy')}
        </div>
        <div className='bg-green-400 dark:bg-green-900  rounded-sm px-1'>
          {format(row.getValue("reserved_at"), 'EEEE')}
        </div> 
      </div>
    },
  },
  {
    accessorKey: "total_price",
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Price
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )},
      cell: ({ row }) => {
        return (
          <div className='flex flex-col items-start text-[0.8rem]'>
              {`₱ ${row.original.total_price}`}
          </div>
        )
      }

  },

  {
    accessorKey: "status",
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )},
  },
  {
    accessorKey: "service_type",
    header: ({column}: any) => {
      return (
        <div className='relative'>
        <Button
          variant="ghost"
          className='px-4 '
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service Type
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        </div>
      )}, 
    cell: ({ row, getValue }: any) => {
      return (
        <div className='flex flex-col items-start text-[0.8rem]'>
            {row.original.service_type}
        </div>
      )
    },
    minSize: 5000
  },
  {
    accessorKey: "add_ons",
    header: ({column}: any) => {
      return (
        <div className='relative'>
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Add ons
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        </div>
      )}, 
    cell: CustomerReservationAddons
  },
  {
    accessorKey: "id",
    header: ({column}: any) => {
      return (
        <div className='relative'>
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reservation ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        </div>
      )},
    size: 1,
    cell: ({ row, getValue }: any) => {
      return (
        <div className='flex flex-col items-start text-[0.7rem]'>
            {row.original.id}
        </div>
      )
    }
  },
  {
    accessorKey: "user_id",
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )},
    size: 1
  },

  {
    accessorKey: "created_at",
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          className='px-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )},
  },

]


const CustomerActiveReservation = ({auth, webInfo, geoLocation, currentUserReservation, pastUserReservation, feedbackDecider}: PageProps) => {

  const customColumnVisiblity = {
    'created_at': false,
  }
  const [currentReservationStatus, setCurrentReservationStatus] = useState<string>(currentUserReservation?.status ? currentUserReservation?.status : 'inactive')
  const stepStyleConfig = {
    activeBgColor: '#fb5607',
    activeTextColor: 'white',
    completedBgColor: '#ced4da',
    completedTextColor: 'white',
    inactiveBgColor: '#000000',
    inactiveTextColor: 'white',
    size: '2em',
    circleFontSize: '1em',
    labelFontSize: '1em',
    borderRadius: '50%',
    fontWeight: 500
  }
  const identifyReservationStatus = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 0
      case 'paid':
        return 1
      case 'waiting':
        return 2
      case 'washing':
        return 3
      case 'pickup':
        return 4
      case 'complete':
        return 5
      default:
        return 0
    }
  }

  const letUserFeedback = (currentReservationStatus: string) => {
    if (currentReservationStatus !== 'complete'){
      return false
    }
    if (feedbackDecider === false){
      return false
    }
    return true;
  }

  useEffect(() => {
    const channel = window.Echo.private(`customerStatus.${auth.user.id}`);
    channel.listen('.reservation-status', (e: any) => {
      setCurrentReservationStatus(e.status['name'])
      if (e?.status['name'] === 'complete'){
        window.location.reload()
      }
      if (e?.oldStatus['name'] === 'complete'){
        window.location.reload()
      }
    })  
  }, [])
  
  if (currentReservationStatus === 'inactive'){
    return (
      <CustomerDashboardTemplate auth={auth} headerText="Dashboard" webInfo={webInfo} geoLocation={geoLocation}>
      <div className='flex flex-col space-y-10'>
        No current booking!
      </div>
    </CustomerDashboardTemplate>
    )


  } else {
    return (
      <CustomerDashboardTemplate auth={auth} headerText="Dashboard" webInfo={webInfo} geoLocation={geoLocation} currentTransaction={auth?.currentTransaction}>
        <div className='flex flex-col space-y-10'>
          {currentReservationStatus !== 'complete' || !isSameDay(parse(currentUserReservation['reserved_at'], 'yyyy-MM-dd HH:mm:ss', new Date()), new Date()) ? (
            <div>
              {currentReservationStatus === 'unpaid' ? (
                    <Alert variant="destructive" className='mb-4 hover:scale-105 transition-all duration-100 select-none' onClick={() => router.get(route('services.awaiting-confirmation', {"intent_id": currentUserReservation?.payment_intent_id}))}>
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Notice!</AlertTitle>
                      <AlertDescription>
                        Service is still unpaid. Click here to proceed.
                      </AlertDescription>
                    </Alert>
              ) : null}
              {!letUserFeedback(currentUserReservation?.status)? (
                <h1 className='text-xl font-semibold px-2 pb-2 flex flex-row items-center relative space-x-2'><MdOutlineNotificationsActive className='text-2xl'/><span>Active Reservation</span></h1>
              ) : (
                <Alert variant='uplift' className='mb-4 hover:scale-105 transition-all duration-100 select-none' onClick={() => router.get(route('customer.review-page'))}>
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Do you like our service?</AlertTitle>
                  <AlertDescription>
                    Click here to leave a feedback
                  </AlertDescription>
                </Alert>
              )}

              <div className='bg-white w-full  rounded-lg shadow-lg p-6 space-y-3'>
                <div className='w-full flex flex-row items-end justify-between'>
                  <div className='flex flex-col'>
                    <span>
                      {`# ${currentUserReservation?.id}`}
                    </span>
                    <div className='flex flex-row space-x-1 font-semibold'>
                      <FaHouse className='text-xl'/>
                      <span>{currentUserReservation?.address}</span>
                    </div>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <span className='font-semibold uppercase'>{`${currentReservationStatus}`}</span>
                    <span>|</span>
                    <span className='font-semibold '>
                      {currentUserReservation['service_type']}
                    </span>
                  </div>
                </div>
                <Separator />
  
  
                <div className='h-32'>
                <Stepper activeStep={identifyReservationStatus(currentReservationStatus)} styleConfig={stepStyleConfig}>
                  <Step label="Unpaid" />
                  <Step label="Paid" />
                  <Step label="Waiting" />
                  <Step label="Washing" />
                  <Step label="Pickup" />
                  <Step label="Completed" />
                </Stepper>
  
                </div>
  
  
                <span className='text-slate-800/80 font-medium tracking-wider mb-1'>Details</span>
                <div className='flex flex-col space-y-2'>
                  <span className='flex flex-row space-x-2 border-l-4 pl-2 border-[#F9844A]'>
                      {`Reserved At: ${format(currentUserReservation['reserved_at'], "EEEE | MMMM dd, yyyy",)}`}
                  </span>
                  <div className='flex flex-row space-x-2 border-l-4 pl-2 border-[#F9844A]'>
                    <span>Addons: </span>
                    {JSON.parse(currentUserReservation['add_ons']).map((addon: any, index: number) => (
                    
                      <span key={index} className='capitalize'>{`${addon}${index < JSON.parse(currentUserReservation?.add_ons).length - 1 ? ',' : ''}`}</span>
                    ))}
                  </div>
  
                </div>
                <Separator />
                <div className='w-full flex flex-row items-end space-x-3 justify-between text-md'>
                  <div className='flex flex-row space-x-2'>
                    <h4 className='text-muted-100 font-medium'>Created At</h4>
                    <span>{format(currentUserReservation?.created_at, 'MMMM dd, yyyy | p')}</span>
                  </div>
                  
                  <div className='flex flex-row items-end space-x-3 '>
                    <span className='tracking-widest'>TOTAL</span>
                    <span className='font-bold'>${currentUserReservation?.total_price}</span>
                  </div>
                </div>
  
  
              </div>
            </div>
          ) : (
            null
          )}
        <div>
              <h1 className='text-xl font-semibold px-2 pb-2 flex flex-row items-center relative space-x-2'><span>Reservation History</span></h1>
              <div className='bg-white w-full  rounded-lg shadow-lg p-6 space-y-3'>
                <DataTable columns={columns} data={pastUserReservation} customColumnVisiblity={customColumnVisiblity}/>
                      
              </div>
            </div>
        </div>
      </CustomerDashboardTemplate>
    )
  }
}

export default CustomerActiveReservation