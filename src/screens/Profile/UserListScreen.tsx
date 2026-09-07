import React, { useEffect, useState } from 'react';
import type { AppNavigation } from '../../types/navigation';
import type { UserProfile } from '../../types/models';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
// react-native's SafeAreaView is iOS-only; this one applies insets on Android too.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { getUser, getClientList } from '../apis/UserService';
import { fileUrl } from '../../utils/fileUrl';

type UserListScreenProps = { navigation: AppNavigation };

const UserListScreen = ({navigation}: UserListScreenProps) => {
  const isFocused = useIsFocused();

  const [users, setUsers] = useState<UserProfile>({});

  useEffect(() => {
    const phone = '9651783692'; 
    loadUsers(phone);
    loadClients();
    // console.log(users)
  }, [isFocused]);

  const loadUsers = async (phone: string) => { 
    
    const response = await getUser(phone);
    setUsers(response.data);
  };

  const loadClients = async () => { 
    
    const response = await getClientList();
    // console.log(response.data)
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          {/* <TouchableOpacity 
                onPress={() => {
                  // handle onPress
                }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity> */}
        </View>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Profile
        </Text>

        <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
          {/* <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon
              color="#000"
              name="more-vertical"
              size={24} />
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 8 }]}>
          <View style={styles.profilecenter} >
          <Image
                alt="" 
                source={{ uri: fileUrl(users.image) }}
                style={styles.profileAvatar} />


            <TouchableOpacity
              onPress={() => {navigation.navigate('UserForm', { user: users })
              }} style={styles.profileEditIcon}>
              <FeatherIcon
                color="#fff" 
                name="edit"
                size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Name</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>{users.name}</Text>
              </View>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Name</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>{users.name}</Text>
              </View>
            </View>

            <View style={styles.rowWrapper}>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Phone</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>{users.phone}</Text>
            </View>
            </View>

            <View style={styles.rowWrapper}>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Email</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>{users.email}</Text>
            </View>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Location</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>Los Angeles, CA</Text>
            </View>
            </View>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Language</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>English</Text>

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Location</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>Los Angeles, CA</Text>

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Email Notifications</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={emailNotifications =>
                    setForm({ ...form, emailNotifications })
                  }
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.emailNotifications} />
              </View>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Push Notifications</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={pushNotifications =>
                    setForm({ ...form, pushNotifications })
                  }
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.pushNotifications} />
              </View>
            </View>
          </View>
        </View> */}
{/* 
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Contact Us</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Report Bug</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Rate in App Store</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Terms and Privacy</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View> */}

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View
              style={[
                styles.rowWrapper,
                styles.rowFirst,
                styles.rowLast,
                { alignItems: 'center' },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor:"#fff",
    borderColor:"#fff",
    borderWidth:2,
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  profilecenter:{
    width: 90,
    margin:"auto",
    height: 90,
    overflow: 'hidden',
  },
  profileEditIcon:{
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor:"#0669ff",
    padding: 4,
    borderRadius: 50,
    borderColor:"#fff",
    borderWidth:2,
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 9999,
    marginRight: 0,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#dc2626',
  },
});
export default UserListScreen;