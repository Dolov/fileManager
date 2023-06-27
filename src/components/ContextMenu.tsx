import React from 'react'
import {
  Menu,
  MenuProps,
  Item,
  ItemProps,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

interface MenuItemProps {
  key: string
  label: React.ReactNode
  onClick(item: MenuItemProps): void
}

export interface ContextMenuProps extends Omit<MenuProps, 'id'> {
  menu: MenuItemProps[]
}

export interface ContextMenuRefProps {
  menuId: string
}

const ContextMenu: React.ForwardRefRenderFunction<ContextMenuRefProps, ContextMenuProps> = (props, ref) => {

  const { children, theme, menu } = props
  const menuId = React.useMemo(() => {
    return `${Math.random()}-${new Date().getTime()}`
  }, [])

  React.useImperativeHandle(ref, () => {
    return {
      menuId,
    }
  }, [])

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: menuId
  });
 
  const handleItemClick: ItemProps["onClick"] = params => {
    console.log('params: ', params);
  }

  const onContextMenu: React.MouseEventHandler<HTMLDivElement> = e => {
    show({
      event: e,
    });
  }

  return (
    <div onContextMenu={onContextMenu}>
      {children}
      <Menu id={menuId} theme={theme}>
        {menu.map(item => {
          const { key, label, onClick } = item
          return (
            <Item key={key} onClick={() => onClick(item)}>
              {label}
            </Item>
          )
        })}
      </Menu>
    </div>
  );
}

export default React.forwardRef<ContextMenuRefProps, ContextMenuProps>(ContextMenu)