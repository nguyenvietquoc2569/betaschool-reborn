import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard';
import styles from './question-management.module.scss';
import { EUserPermissions } from '@betaschool-reborn/beta-data-type';

/* eslint-disable-next-line */
export interface QuestionManagementProps {}

export function QuestionManagement(props: QuestionManagementProps) {
  return (
    <>
    <PermissionGuard permissions={[EUserPermissions.VITALTESTEDITOR]}>
      <div className={styles['container']}>
        <h1>Welcome to QuestionManagement!</h1>
      </div>
    </PermissionGuard>
    
    </>
  );
}

export default QuestionManagement;
