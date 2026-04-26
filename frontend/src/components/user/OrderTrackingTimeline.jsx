import React from "react";
import { motion } from "framer-motion";
import {
  AiOutlineShoppingCart,
  AiOutlineCheckCircle,
  AiOutlineCar,
  AiOutlineHome,
  AiOutlineCheck
} from "react-icons/ai";

const OrderTrackingTimeline = ({ status, timeline = [] }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
      case 'Order Confirmed':
        return <AiOutlineShoppingCart className="w-5 h-5" />;
      case 'Packed':
        return <AiOutlineCheckCircle className="w-5 h-5" />;
      case 'Shipped':
        return <AiOutlineCar className="w-5 h-5" />;
      case 'Out for Delivery':
        return <AiOutlineHome className="w-5 h-5" />;
      case 'Delivered':
        return <AiOutlineCheck className="w-5 h-5" />;
      default:
        return <AiOutlineShoppingCart className="w-5 h-5" />;
    }
  };



  const getProgressColor = (status) => {
    switch (status) {
      case 'Order Placed':
      case 'Order Confirmed':
        return "bg-blue-500";
      case 'Packed':
        return "bg-yellow-500";
      case 'Shipped':
      case 'Out for Delivery':
        return "bg-orange-500";
      case 'Delivered':
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const statusSteps = [
    { key: 'Order Placed', label: 'Order Placed', description: 'Your order has been received' },
    { key: 'Order Confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed' },
    { key: 'Packed', label: 'Packed', description: 'Your order is being packed' },
    { key: 'Shipped', label: 'Shipped', description: 'Your order has been shipped' },
    { key: 'Out for Delivery', label: 'Out for Delivery', description: 'Your order is out for delivery' },
    { key: 'Delivered', label: 'Delivered', description: 'Your order has been delivered' },
  ];

  const getCurrentStepIndex = () => {
    const statusIndex = statusSteps.findIndex(step => step.key === status);
    return statusIndex !== -1 ? statusIndex : 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

  const formatTimelineDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

   return (
     <div className="bg-white rounded-3xl p-6 organic-card">
       <h3 className="text-lg font-display font-semibold text-[#262626] mb-6">Order Tracking</h3>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-400'
                  }`}
                >
                  {getStatusIcon(step.key)}
                </motion.div>

                {/* Step Label */}
                <div className="text-center mt-2">
                  <div className={`text-xs font-medium ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-20">
                    {step.description}
                  </div>
                </div>

                {/* Connecting Line */}
                {index < statusSteps.length - 1 && (
                  <div className={`absolute top-5 left-10 w-full h-0.5 ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{ width: 'calc(100vw / 6 - 2.5rem)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full ${getProgressColor(status)}`}
          />
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Current Status</h4>
            <p className="text-sm text-gray-600">{statusSteps[currentStepIndex]?.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'Delivered' ? 'bg-green-100 text-green-800' :
            status === 'Cancelled' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </div>
        </div>
      </div>

      {/* Timeline Details */}
      {timeline && timeline.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Order Timeline</h4>
          <div className="space-y-3">
            {timeline
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.status === status ? 'bg-blue-500' : 'bg-green-500'
                  } text-white`}>
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{event.status}</h5>
                      <span className="text-sm text-gray-500">
                        {formatTimelineDate(event.timestamp)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Delivery Information */}
      {status === 'Out for Delivery' && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AiOutlineHome className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Out for Delivery</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your order is on its way! Our delivery partner will contact you shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'Delivered' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AiOutlineCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Order Delivered</h4>
              <p className="text-sm text-green-700 mt-1">
                Your order has been successfully delivered. Enjoy your purchase!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingTimeline;
