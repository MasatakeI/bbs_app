import React, { useEffect } from "react";
import "./SideMenu.css";

import { useDispatch, useSelector } from "react-redux";
import {
  selectAllChannels,
  selectChannelsError,
  selectChannelsIsLoading,
} from "@/redux/features/channels/channelsSelector";

import { NavLink } from "react-router";
import { fetchChannelsAsync } from "@/redux/features/channels/channelsThunks";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/common/Button/Button";
import ChannelTextBox from "@/components/widgets/TextBox/ChannelTextBox";

const SideMenu = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const isLoading = useSelector(selectChannelsIsLoading);
  const error = useSelector(selectChannelsError);

  useEffect(() => {
    dispatch(fetchChannelsAsync());
  }, [dispatch]);

  const channelsContent = () => {
    // if (error) {
    //   return (
    //     <button onClick={() => dispatch(fetchChannelsAsync())}>
    //       再読み込み
    //     </button>
    //   );
    // }
    if (isLoading) {
      return (
        <>
          <LoadingSpinner />
        </>
      );
    }

    return (
      <>
        <ul className="menu-list">
          {channels.map(({ id, name }) => {
            return (
              <li className="menu-item" key={id}>
                <NavLink
                  to={`/channels/${id}`}
                  className={({ isActive }) =>
                    isActive ? "menu-item-link active" : "menu-item-link"
                  }
                  role="link"
                  aria-label="channel-name"
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <ChannelTextBox />
      </>
    );
  };

  return <div className="side-menu">{channelsContent()}</div>;
};

export default SideMenu;
