import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/plugins/axios';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personOutline,
  settingsOutline,
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  bookmarkSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  peopleOutline
} from 'ionicons/icons';

addIcons({
  'home-outline': homeOutline,
  'person-outline': personOutline,
  'people-outline': peopleOutline,
  'settings-outline': settingsOutline,
  'archive-outline': archiveOutline,
  'archive-sharp': archiveSharp,
  'bookmark-outline': bookmarkOutline,
  'bookmark-sharp': bookmarkSharp,
  'heart-outline': heartOutline,
  'heart-sharp': heartSharp,
  'mail-outline': mailOutline,
  'mail-sharp': mailSharp,
  'paper-planeOutline': paperPlaneOutline,
  'paper-planeSharp': paperPlaneSharp,
  'trash-outline': trashOutline,
  'trash-sharp': trashSharp,
  'warning-outline': warningOutline,
  'warning-sharp': warningSharp,
});

export const useUserStore = defineStore('user', () => {
  const ADMINISTRADOR_ID = 1;
  const token = ref();
  const user = ref({ name: '', id: 0, persona_id: 0, dependencia: { descripcion: ''}, permissions: [], roles: []});
  const menu = ref([]);
  const fullMenu = [
      { permission: null, route: '/home', icon: homeOutline, label: "Inicio" },
      { permission: null, route: '/admin/users', icon: peopleOutline, label: "Users" },
      { permission: null, route: '/folder/Outbox', icon: paperPlaneSharp, label: "Outbox" },
      { permission: null, route: '/folder/Favorites', icon: heartSharp, label: "Favorites" },
      { permission: null, route: '/folder/Archived', icon: archiveSharp, label: "Archived" },
      { permission: null, route: '/folder/Trash', icon: trashSharp, label: "Trash" },
      { permission: null, route: '/folder/Spam', icon: warningSharp, label: "Spam" },
  ];

  const isSuperAdmin = () => user.value.roles.some(r => r.id <= ADMINISTRADOR_ID);

  const setUser = async(userData) => {
    user.value = { ...user.value, ...userData };
    if(userData.access_token) {
      sessionStorage.setItem('access_token', userData.access_token);
      token.value = userData.access_token;
    }
    //user.value.permissions = userData.permissions.map(permission => permission.name);
  };

  const getAvailableMenu = () => {
    const filterMenu = (items) => {
      return items
        .filter(item => {
          if (!item.permission) return true;
          return user.value.permissions.some(p => p.name === item.permission);
        })
        .map(item => {
          if (item.children) {
            return {
              ...item,
              children: filterMenu(item.children)
            };
          }
          return item;
        });
    };

    return isSuperAdmin()
      ? fullMenu
      : filterMenu(fullMenu);
  };

  const setMenu = async() => {
    menu.value = getAvailableMenu();
  };

  const fetchUserProfile = () => {
    return axios.get('/me').then(response => {
      setUser(response.data)
    })
  };

  const logout = async() => {
    try {
      await axios.post('/logout')
      setTimeout(() => {
        setUser(null);
        window.location.href = '/login'
      }, 0);
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  };

  return {
    user,
    token,
    menu,
    isSuperAdmin,
    setUser,
    setMenu,
    fetchUserProfile,
    logout,
  };
});
