import React from 'react';
import PWDDepartmentPanel from './PWDDepartmentPanel';
import HealthDepartmentPanel from './HealthDepartmentPanel';

export default function DepartmentPanel({ tab = 'department_pwd' }) {
  if (tab === 'department_health') {
    return <HealthDepartmentPanel />;
  }
  return <PWDDepartmentPanel />;
}
