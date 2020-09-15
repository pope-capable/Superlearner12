import React, { useState } from 'react'
import {notification } from 'antd';

export function antdNotification(type, message, description) {
    return notification[type]({
        message: message,
        description: description,
      });
}