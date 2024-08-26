import React from 'react'
import { createComponent } from '@lit/react'

import { Card } from '@kyndryl-design-system/shidoka-foundation/components/card/index'
import { Icon } from '@kyndryl-design-system/shidoka-foundation/components/icon/index'
import { Button } from '@kyndryl-design-system/shidoka-foundation/components/button/index'
import { Modal } from '@kyndryl-design-system/shidoka-applications/components/reusable/modal'
import { Tabs, Tab, TabPanel } from '@kyndryl-design-system/shidoka-applications/components/reusable/tabs/index'
import { TextArea } from '@kyndryl-design-system/shidoka-applications/components/reusable/textArea'
import { DateRangePicker } from '@kyndryl-design-system/shidoka-applications/components/reusable/daterangepicker'
import { SideDrawer } from '@kyndryl-design-system/shidoka-applications/components/reusable/sideDrawer'
import { PageTitle } from '@kyndryl-design-system/shidoka-applications/components/reusable/pagetitle'
import { GlobalFilter } from '@kyndryl-design-system/shidoka-applications/components/reusable/globalFilter'
import { TextInput } from '@kyndryl-design-system/shidoka-applications/components/reusable/textInput'
import { DatePicker } from '@kyndryl-design-system/shidoka-applications/components/reusable/datePicker'
import { Notification } from "@kyndryl-design-system/shidoka-applications/components/reusable/notification"
import { Link } from '@kyndryl-design-system/shidoka-foundation/components/link/index';
import { Tooltip } from '@kyndryl-design-system/shidoka-applications/components/reusable/tooltip/index';
import { Footer } from '@kyndryl-design-system/shidoka-applications/components/global/footer/index'
import { UiShell } from '@kyndryl-design-system/shidoka-applications/components/global/uiShell/index'
import { HeaderFlyouts } from '@kyndryl-design-system/shidoka-applications/components/global/header/headerFlyouts'
import { HeaderFlyout } from '@kyndryl-design-system/shidoka-applications/components/global/header/headerFlyout'
import { HeaderUserProfile } from '@kyndryl-design-system/shidoka-applications/components/global/header/headerUserProfile'
import { HeaderLink } from '@kyndryl-design-system/shidoka-applications/components/global/header/headerLink'
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableLegend, TableLegendItem, TableRow } from '@kyndryl-design-system/shidoka-applications/components/reusable/table'
import { Pagination } from '@kyndryl-design-system/shidoka-applications/components/reusable/pagination'
import { TagGroup } from '@kyndryl-design-system/shidoka-applications/components/reusable/tag/tagGroup'
import { Tag } from '@kyndryl-design-system/shidoka-applications/components/reusable/tag/tag'
import {Accordion, AccordionItem} from '@kyndryl-design-system/shidoka-foundation/components/accordion'
import { Checkbox, CheckboxGroup } from '@kyndryl-design-system/shidoka-applications/components/reusable/checkbox'
import {RadioButton, RadioButtonGroup} from '@kyndryl-design-system/shidoka-applications/components/reusable/radioButton'
import { Dropdown } from '@kyndryl-design-system/shidoka-applications/components/reusable/dropdown/dropdown'
import { DropdownOption } from '@kyndryl-design-system/shidoka-applications/components/reusable/dropdown/dropdownOption'
import { OverflowMenu, OverflowMenuItem } from '@kyndryl-design-system/shidoka-applications/components/reusable/overflowMenu/index'

import { HeaderCategory, HeaderNav, HeaderDivider } from '@kyndryl-design-system/shidoka-applications/components/global/header'

import {NumberInput} from '@kyndryl-design-system/shidoka-applications/components/reusable/numberInput/numberInput'
import { Loader } from '@kyndryl-design-system/shidoka-applications/components/reusable/loaders/loader'


export const KDLoader= createComponent({
  tagName: 'kyn-loader',
  elementClass: Loader,
  react: React,
})

export const KDNumberInput= createComponent({
  tagName: 'kyn-number-input',
  elementClass: NumberInput,
  react: React,
  events: {
    onChange: 'on-input'
  }
})

export const KDHeaderDivider= createComponent({
  tagName: 'kyn-header-divider',
  elementClass: HeaderDivider,
  react: React,
  events: {
    onChange: 'on-change'
  }
})

export const KDHeaderCategory = createComponent({
  tagName: 'kyn-header-category',
  elementClass: HeaderCategory,
  react: React,
  events: {
    onChange: 'on-change'
  }
})

export const KDHeaderNav = createComponent({
  tagName: 'kyn-header-nav',
  elementClass: HeaderNav,
  react: React,
  events: {
    onChange: 'on-change'
  }
})

export const KDOverflowMenu = createComponent({
  tagName: 'kyn-overflow-menu',
  elementClass: OverflowMenu,
  react: React,
  events: {
    onChange: 'on-change'
  }
})

export const KDOverflowMenuItem = createComponent({
  tagName: 'kyn-overflow-menu-item',
  elementClass: OverflowMenuItem,
  react: React,
  events: {
    onChange: 'on-change'
  }
})

export const KDDropDown = createComponent({
  tagName: 'kyn-dropdown',
  elementClass: Dropdown,
  react: React,
  events: {
    onChange: 'on-change'
  }
})

export const KDDropDownOption = createComponent({
  tagName: 'kyn-dropdown-option',
  elementClass: DropdownOption,
  react: React
})

export const KDRadioButtonGroup = createComponent({
  tagName: 'kyn-radio-button-group',
  elementClass: RadioButtonGroup,
  react: React,
  events: {
    onChange: 'on-radio-group-change'
  }
})

export const KDRadioButton = createComponent({
  tagName: 'kyn-radio-button',
  elementClass: RadioButton,
  react: React,
  events: {
    onChange: 'on-radio-change'
  }
})


export const KDTagGroups = createComponent({
  tagName: 'kyn-tag-group',
  elementClass: TagGroup,
  react: React
})

export const KDAccordion = createComponent({
  tagName: 'kd-accordion',
  elementClass: Accordion,
  react: React
})

export const KDAccordionItem = createComponent({
  tagName: 'kd-accordion-item',
  elementClass: AccordionItem,
  react: React
})

export const KDCheckboxGroup = createComponent({
  tagName: 'kyn-checkbox-group',
  elementClass: CheckboxGroup,
  react: React,
  events: {
    'onChange': 'on-checkbox-group-change'
  }
})

export const KDCheckbox = createComponent({
  tagName: 'kyn-checkbox',
  elementClass: Checkbox,
  react: React,
  events: {
    'onChange': 'on-checkbox-group-change'
  }
})

export const KDTableContainer = createComponent({
  tagName: 'kyn-table-container',
  elementClass: TableContainer,
  react: React
})

export const KDTable = createComponent({
  tagName: 'kyn-table',
  elementClass: Table,
  react: React
})

export const KDTHeader = createComponent({
  tagName: 'kyn-thead',
  elementClass: TableHead,
  react: React
})

export const KDTTr = createComponent({
  tagName: 'kyn-tr',
  elementClass: TableRow,
  react: React,
  events: {
    onSelect: 'on-row-select'
  }
})

export const KDTTh = createComponent({
  tagName: 'kyn-th',
  elementClass: TableHeader,
  react: React
})

export const KDTBody = createComponent({
  tagName: 'kyn-tbody',
  elementClass: TableBody,
  react: React
})

export const KDTTd = createComponent({
  tagName: 'kyn-td',
  elementClass: TableCell,
  react: React
})

export const KDTFooter = createComponent({
  tagName: 'kyn-table-footer',
  elementClass: TableFooter,
  react: React
})

export const KDTLegend = createComponent({
  tagName: 'kyn-table-legend',
  elementClass: TableLegend,
  react: React
})

export const KDTLegendItem = createComponent({
  tagName: 'kyn-table-legend-item',
  elementClass: TableLegendItem,
  react: React
})

export const KDPagination = createComponent({
  tagName: 'kyn-pagination',
  elementClass: Pagination,
  react: React,
  events: {
    'onPageSizeChange': 'on-page-size-change',
    'onPageNumberChange': 'on-page-number-change'
  }
})

export const KDFooter = createComponent({
  tagName: 'kyn-footer',
  elementClass: Footer,
  react: React
})

export const KDShell = createComponent({
  tagName: 'kyn-ui-shell',
  elementClass: UiShell,
  react: React
})

export const KDTooltip = createComponent({
  tagName: 'kyn-tooltip',
  elementClass: Tooltip,
  react: React
})

export const KDTabs = createComponent({
  tagName: 'kyn-tabs',
  elementClass: Tabs,
  react: React,
  events: {
    onChange: 'on-change',
  }
})

export const KDTab = createComponent({
  tagName: 'kyn-tab',
  elementClass: Tab,
  react: React
})

export const KDTabPanel = createComponent({
  tagName: 'kyn-tab-panel',
  elementClass: TabPanel,
  react: React
})

export const KDIcon = createComponent({
  tagName: 'kd-icon',
  elementClass: Icon,
  react: React,
})

export const KDButton = createComponent({
  tagName: 'kd-button',
  elementClass: Button,
  react: React,
  events: {
    onClick: 'on-click',
  }
})

export const ModalBox = createComponent({
  tagName: 'kyn-modal',
  elementClass: Modal,
  react: React,
  events: {
    onClose: 'on-close',
  }
})

export const CheckBox = createComponent({
  tagName: 'kyn-checkbox',
  elementClass: Checkbox,
  react: React,
  events: {
    onSelect: 'on-checkbox-change'
  }
})

export const KDCard = createComponent({
  tagName: 'kd-card',
  elementClass: Card,
  react: React,
  events: {
    onCardClick: 'on-card-click'
  }
})

export const CheckBoxGroup = createComponent({
  tagName: 'kyn-checkbox-group',
  elementClass: CheckboxGroup,
  react: React,
  events: {
    onCheckboxGroupChange: 'on-checkbox-group-change',
  }
})

export const KDTextArea = createComponent({
  tagName: 'kyn-text-area',
  elementClass: TextArea,
  react: React,
  events: {
    onInput: 'on-input',
  }
})

export const DateRange = createComponent({
  tagName: 'kyn-date-range-picker',
  elementClass: DateRangePicker,
  react: React,
  events: {
    onInput: 'on-input',
  }
})

export const KDDrawer = createComponent({
  tagName: 'kyn-side-drawer',
  elementClass: SideDrawer,
  react: React,
  events: {
    onClose: 'on-close',
  }
})

export const KDTag = createComponent({
  tagName: 'kyn-tag',
  elementClass: Tag,
  react: React,
  events: {
    onClose: 'on-close'
  }
})

export const FilterBox = createComponent({
  tagName: 'kyn-global-filter',
  elementClass: GlobalFilter,
  react: React
})

export const Textbox = createComponent({
  tagName: 'kyn-text-input',
  elementClass: TextInput,
  react: React,
  events: {
    onOnInput: 'on-on-input',
    inputChange: 'on-input'
  }
})

export const KDTagGroup = createComponent({
  tagName: 'kyn-tag-Group',
  elementClass: TagGroup,
  react: React
})

export const KDDatePicker = createComponent({
  tagName: 'kyn-date-picker',
  elementClass: DatePicker,
  react: React,
  events: {
    onDateChange: 'on-input'
  }
})

export const KDDateRangePicker = createComponent({
  tagName: 'kyn-date-range-picker',
  elementClass: DateRangePicker,
  react: React,
  events: {
    onDateChange: 'on-input'
  }
})

export const CustomerDetailPageTitle = createComponent({
  tagName: 'kyn-page-title',
  elementClass: PageTitle,
  react: React
})

export const CustomCard = createComponent({
  tagName: 'kd-card',
  elementClass: Card,
  react: React
})

export const KDNotification = createComponent({
  tagName: 'kyn-notification',
  elementClass: Notification,
  react: React,
  events: {
    onClose: 'on-close'
  }
});

export const KDLink = createComponent({
  tagName: 'kd-link',
  elementClass: Link,
  react: React
});

export const KDHeaderFlyouts = createComponent({
  tagName: 'kyn-header-flyouts',
  elementClass: HeaderFlyouts,
  react: React
})

export const KDHeaderFlyout = createComponent({
  tagName: 'kyn-header-flyout',
  elementClass: HeaderFlyout,
  react: React
})

export const KDHeaderUserProfile = createComponent({
  tagName: 'kyn-header-user-profile',
  elementClass: HeaderUserProfile,
  react: React
})

export const KDHeaderLink = createComponent({
  tagName: 'kyn-header-link',
  elementClass: HeaderLink,
  react: React,
  events: {
    onClick: 'on-click'
  }
})