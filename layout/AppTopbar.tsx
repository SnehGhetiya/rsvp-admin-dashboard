/* eslint-disable @next/next/no-img-element */

import { AppTopbarRef, LayoutConfig } from '@/types';
import Link from 'next/link';
import { PrimeReactContext } from 'primereact/api';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef<AppTopbarRef>((_props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutConfig } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const { setRipple, changeTheme } = useContext(PrimeReactContext);
    const [isToggled, setIsToggled] = useState(false);

    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            setIsToggled(() => JSON.parse(window.localStorage.getItem('isToggled') ?? 'false'));
        }
    }, []);

    useLayoutEffect(() => {
        if (typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem('isToggled') ?? 'false')) {
            _changeTheme('lara-dark-purple', 'dark');
        } else {
            _changeTheme('lara-light-purple', 'light');
        }
    }, []);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const changeRipple = (e: InputSwitchChangeEvent) => {
        setRipple?.(e.value as boolean);
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, ripple: e.value as boolean }));
        if (e?.target?.value === true) {
            setIsToggled(() => true);
            window.localStorage.setItem('isToggled', JSON.stringify(true));
            _changeTheme('lara-dark-purple', 'dark');
        } else {
            setIsToggled(() => false);
            window.localStorage.setItem('isToggled', JSON.stringify(false));
            _changeTheme('lara-light-purple', 'light');
        }
    };

    const _changeTheme = (theme: string, colorScheme: string) => {
        changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        });
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>SAKAI</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>

                <div className={classNames('p-link layout-topbar-toggle-container', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                    <InputSwitch checked={!!isToggled as boolean} onChange={(e) => changeRipple(e)}></InputSwitch>
                    <span className="theme-span">Toggle Theme</span>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
