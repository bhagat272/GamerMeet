import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {requestSubscription, useIAP, withIAPContext} from 'react-native-iap';
import {useDispatch, useSelector} from 'react-redux';
import {AppButton, Background} from '../../../components';
import {
  profileAction,
  saveUserData,
} from '../../../redux/actions/userSessionAction';
import {post} from '../../../redux/apis/apiHelper';
import {JSON_HEADER} from '../../../redux/apis/commonValue';
import {APP_SESSION_API} from '../../../redux/apis/endpoints';
import {loading} from '../../../redux/reducer/loadingReducer';
import imagePath from '../../../theme/imagePath';
import {getDeviceUniqueId} from '../../../utils/helper';
import {translateText} from '../../../utils/language';
import {showToastMessage} from '../../../utils/toast';
import styles from './styles';

let stopPurchaseMethodRecursive = true;
let availablePurchaseCalling = false;

const Subscription = (props: any) => {
  const dispatch = useDispatch();
  const {type} = props?.route?.params ? props?.route?.params : false;
  const [plans, setPlans] = useState<Record<string, any>>([
    {
      id: 1,
      plan: 'Free',
      price: 0,
      plan_detail_id: 1,
      created_by: 1,
      plan_name: 'Free Plan',
      plan_desc: '',
      productId: 'com.free',
      inapp_plan_id: 'com.free',
      android_plan_id: 'com.free',
      plan_period: '1',
      status: 1,
      isSelect: false,
      type: 'subscription',
      feature:
        '1. Create profile\n2. Unlimited matching \n3. Unlimited profile browsing \n4. Advanced filters\n5. See who has expressed interest\n6. Unlimited messaging\n7. With Ads\n8. Profile boosts\n9. Ad-free experience',
    },
    {
      id: 2,
      plan: 'Monthly',
      price: 1.99,
      plan_detail_id: 2,
      created_by: 1,
      plan_name: 'Standard Plan',
      plan_desc: 'Monthly',
      productId: 'com.monthly',
      inapp_plan_id: 'com.monthly',
      android_plan_id: 'com.monthly',
      plan_period: '1',
      status: 1,
      isSelect: false,
      type: 'subscription',
      feature:
        '1. Create profile\n2. Unlimited matching \n3. Unlimited profile browsing \n4. Advanced filters\n5. See who has expressed interest\n6. Unlimited messaging\n7. With Ads\n8. Profile boosts\n9. Ad-free experience',
    },
    // {
    //   id: 1,
    //   plan: 'Yearly',
    //   price: 1.99,
    //   plan_detail_id: 1,
    //   created_by: 1,
    //   plan_name: 'Premium Plan',
    //   plan_desc: 'yearly',
    //   productId: 'com.yearly',
    //   inapp_plan_id: 'com.yearly',
    //   android_plan_id: 'com.yearly',
    //   plan_period: '1',
    //   status: 1,
    //   isSelect: false,
    //   type: 'subscription',
    //   feature:
    //     '1. Create profile\n2. Unlimited matching \n3. Unlimited profile browsing \n4. Advanced filters\n5. See who has expressed interest\n6. Unlimited messaging\n7. With Ads\n8. Profile boosts\n9. Ad-free experience',
    // },
  ]);

  const [purchasePlan, setPurchasePlan] = useState<Record<string, any>>({
    productId: 'com.free',
    plan: 'Free',
  });
  const {
    connected,
    subscriptions,
    currentPurchase,
    currentPurchaseError,
    availablePurchases,
    getProducts,
    getSubscriptions,
    finishTransaction,
    getAvailablePurchases,
    products,
  } = useIAP();
  const {show} = useSelector((state: any) => state.loading);
  const [iapLoaded, setIapLoaded] = useState(false);

  console.log('====================================');
  console.log('Connected:', connected);
  console.log('Subscriptions length:', subscriptions?.length);

  console.log('purchasePlan', subscriptions);
  console.log('====================================');
  useEffect(() => {
    if (connected) {
      (async () => {
        dispatch(loading(true));
        await methodGetSubscriptions();
        // get Products
        // await handleGetProducts();
      })();
    }
  }, [connected]);

  // old code
  //useEffect(() => {
  //   //get subscription plans
  //   if (subscriptions?.length) {
  //     // console.log('plans', plans);
  //     methodPlanDataSet(plans);
  //     dispatch(loading(false));
  //   }
  // }, [subscriptions]);
  useEffect(() => {
    if (iapLoaded && subscriptions?.length) {
      methodPlanDataSet(plans);
    }
  }, [iapLoaded, subscriptions]);

  // called on purchase cancel failed plan purchase
  useEffect(() => {
    if (currentPurchaseError) {
      showToastMessage(translateText('Payment_not_processed'));
      dispatch(loading(false));
    }
  }, [currentPurchaseError]);

  // // called on plan purchase success
  useEffect(() => {
    const checkCurrentPurchase = async (purchase: any) => {
      // console.log('condition', !!(!stopPurchaseMethodRecursive && purchase));
      // console.log('purchasePlan', purchasePlan);
      // console.log('inside use effect purchase');
      if (!stopPurchaseMethodRecursive && purchase) {
        // console.log('inside if of use effect purchase');

        stopPurchaseMethodRecursive = true;
        const receipt = purchase?.transactionReceipt;
        if (receipt) {
          try {
            const subsObj: any = {purchase};

            if (purchasePlan?.type === 'product') {
              subsObj.isConsumable = true;
            }

            // console.log(
            //   'inside if of use effect purchase awaiting finishTransaction',
            // );

            await finishTransaction(subsObj);

            methodReceiptSendToServer(purchase);
          } catch (ackErr) {
            dispatch(loading(false));
          }
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  // // called on restore
  useEffect(() => {
    if (availablePurchaseCalling) {
      availablePurchaseCalling = false;
      console.log('################', availablePurchases);
      if (availablePurchases && availablePurchases.length > 0) {
        console.log('*************');
        // Sort availablePurchases by date in descending order assuming each purchase has a date property
        const sortedPurchases: Record<string, any>[] = availablePurchases.sort(
          (a: any, b: any) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime(),
        );
        // The most recent purchase
        const latestPurchase: any = sortedPurchases[0];

        // console.log('availablePurchases ', availablePurchases);
        // cosumeProduct(availablePurchases);
        // Call your restore API function with the most recent purchase
        methodRestoreApiCall(latestPurchase);
      } else {
        dispatch(loading(false));
        showToastMessage(translateText('Subscription_plan_not_purchased'));
      }
    }
  }, [availablePurchases]);

  const methodSetPurchasedPlan = (
    subscriptionsArr: Array<Record<string, any>> = [],
  ) => {
    if (globalThis?.userData?.is_premium) {
      if (subscriptionsArr?.length) {
        let matchedPlan = subscriptionsArr?.find(
          (data: Record<string, any>) =>
            data?.productId == globalThis?.userData?.plan_id,
        );
        // console.log('matchedPlan--->', matchedPlan);
        if (matchedPlan) {
          setPurchasePlan(matchedPlan);
        }
      }
    }
  };

  const methodGetSubscriptions = async () => {
    dispatch(loading(false));
    const skus: any = Platform.select({
      ios: ['com.monthly', 'com.yearly'],
      android: ['com.monthly', 'com.yearly'],
    });

    try {
      await getSubscriptions({skus});
      dispatch(loading(false));
    } catch (error) {
      dispatch(loading(false));
    } finally {
      setIapLoaded(true); // ✅ IMPORTANT
      dispatch(loading(false));
    }
  };

  // PRODUCTS

  // PRODUCTS METHODS END
  const methodInAppStoreDataSet = (apiData: any) => {
    let arrProduct = subscriptions.filter(
      data => data?.productId == apiData?.productId,
    );
    if (arrProduct && arrProduct.length > 0) {
      let dicStorePlan: any = arrProduct[0];
      if (Platform.OS == 'android') {
        let arrOfferDetails = dicStorePlan?.subscriptionOfferDetails;
        if (arrOfferDetails && arrOfferDetails.length > 0) {
          if (
            arrOfferDetails[0]?.pricingPhases?.pricingPhaseList &&
            arrOfferDetails[0]?.pricingPhases?.pricingPhaseList.length > 0
          ) {
            return {
              ...dicStorePlan,
              localizedPrice:
                arrOfferDetails[0]?.pricingPhases?.pricingPhaseList[
                  arrOfferDetails[0]?.pricingPhases?.pricingPhaseList?.length -
                    1
                ]?.formattedPrice,
              currency:
                arrOfferDetails[0]?.pricingPhases?.pricingPhaseList[
                  arrOfferDetails[0]?.pricingPhases?.pricingPhaseList?.length -
                    1
                ]?.priceCurrencyCode,
            };
          }
        }
      } else {
        return dicStorePlan;
      }
    }
    return {...apiData, localizedPrice: '$' + apiData?.price};
  };

  const methodPlanDataSet = (planDetails: any) => {
    console.log('subscriptions---->', subscriptions);

    if (subscriptions && subscriptions.length > 0) {
      if (planDetails && planDetails.length > 0) {
        let arrPlanCycleDetails = [...planDetails];
        // console.log('arrUpdatePlanPrice---->', arrPlanCycleDetails);
        let arrUpdatePlanPrice: Record<string, any>[] = arrPlanCycleDetails.map(
          data => {
            let storeData = methodInAppStoreDataSet(data);
            return {...data, ...{inAppStore: storeData}};
          },
        );
        // console.log('arrUpdatePlanPrice---->', arrUpdatePlanPrice);
        let basicPlan: Record<string, any> = [];
        let premiumPlan: Record<string, any> = [];
        arrUpdatePlanPrice?.forEach(
          (data: Record<string, any>, index: number) => {
            if (data?.inAppStore?.productId?.includes('basic')) {
              basicPlan.push(data);
            } else {
              premiumPlan.push(data);
            }
          },
        );
        console.log('arrUpdatePlanPrice---->222222', arrUpdatePlanPrice);
        methodSetPurchasedPlan(arrUpdatePlanPrice);
        setPlans(arrUpdatePlanPrice);
      }
    }
  };

  const methodPurchase = async (item: Record<string, any>) => {
    // console.log('item>>>', item);

    if (!item?.productId) {
      showToastMessage('Please select plan');
      return;
    }
    if (item?.plan === 'Free') {
      showToastMessage('Free plan is already available.');
      return;
    }
    // includes ['com.price_1', 'com.price_2', 'com.price_3']

    // console.log('purchasePlan--->', purchasePlan);
    dispatch(loading(true));

    let deviceInfo = await getDeviceUniqueId();
    let uuidTemp = deviceInfo;

    stopPurchaseMethodRecursive = false;
    setPurchasePlan({...item, appAccountToken: uuidTemp});
    let dic: any = {};
    if (Platform.OS == 'ios') {
      dic = {sku: item?.productId, appAccountToken: uuidTemp};
    } else {
      let subscriptionOfferDetails =
        item?.inAppStore?.subscriptionOfferDetails &&
        item?.inAppStore?.subscriptionOfferDetails.length > 0
          ? [
              {
                sku: item?.productId,
                offerToken:
                  item?.inAppStore?.subscriptionOfferDetails[0]?.offerToken,
              },
            ]
          : [{sku: item?.productId, offerToken: ''}];
      dic = {
        sku: item?.productId,
        subscriptionOffers: subscriptionOfferDetails,
      };
    }

    await requestSubscription(dic);
  };

  const methodReceiptSendToServer = async (purchase: Record<string, any>) => {
    if (!purchase?.transactionReceipt) {
      showToastMessage('Subscription plan not yet purchased.');
      dispatch(loading(false));
      return;
    }
    // console.log('====purchse log==', purchase);
    let price =
      Platform.OS == 'android'
        ? parseFloat(
            purchasePlan?.inAppStore?.localizedPrice?.replace(/[^\d.-]/g, ''),
          )
        : parseFloat(purchasePlan?.inAppStore?.price?.replace(/[^\d.-]/g, ''));
    let request = {
      transaction_id: purchase?.transactionId,
      receipt: purchase?.transactionReceipt,
      currency: purchasePlan?.inAppStore?.currency,
      amount: price,
      platform: Platform.OS.toUpperCase(),
      payment_time: purchase?.transactionDate,
      plan_id: purchasePlan?.productId,
      local_amount: parseFloat(
        purchasePlan?.inAppStore?.price?.replace(/[^\d.-]/g, ''),
      ),
      original_transaction_id:
        Platform.OS == 'ios'
          ? purchase?.originalTransactionIdentifierIOS
            ? purchase?.originalTransactionIdentifierIOS
            : purchase?.transactionId
          : purchase?.transactionId,
      android_purchase_token:
        Platform.OS == 'ios' ? '' : purchase?.purchaseToken,
      appAccountToken: purchasePlan?.appAccountToken,
    };

    try {
      const response = await post({
        url: APP_SESSION_API?.in_app_purchase,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('-------------response of purchase api', response?.data);
      if (response && response?.success) {
        // saveUserData(
        //   {
        //     ...userData,
        //     data: {
        //       is_premium: true,
        //     },
        //   },
        //   dispatch,
        // );
        globalThis.userData = {
          ...globalThis.userData,
          is_premium: true,
          plan_id: purchasePlan?.productId,
        };
        dispatch(profileAction()),
          showToastMessage(response.message, 'success');
      } else {
        showToastMessage(response.message);
      }
      dispatch(loading(false));
    } catch (error) {
      dispatch(loading(false));
      showToastMessage('Subscription plan not yet purchased.');
    }
  };

  const methodGetAvailablePurchase = async () => {
    availablePurchaseCalling = true;
    dispatch(loading(true));
    try {
      await getAvailablePurchases();
    } catch (error) {
      availablePurchaseCalling = false;
      dispatch(loading(false));
    }
  };

  const methodRestoreApiCall = async (purchase: Record<string, any>) => {
    let data = {
      transaction_id: purchase?.transactionId,
      receipt: purchase?.transactionReceipt,
      platform: Platform.OS.toUpperCase(),
      payment_time: purchase?.transactionDate,
      plan_id: purchase?.productId,

      original_transaction_id:
        Platform.OS == 'ios'
          ? purchase?.originalTransactionIdentifierIOS
            ? purchase?.originalTransactionIdentifierIOS
            : purchase?.transactionId
          : purchase?.transactionId,
    };
    try {
      console.log('requested subscription data', JSON.stringify(data));
      const response = await post({
        url: APP_SESSION_API?.in_app_purchase_restore,
        data: JSON.stringify(data),
        header: JSON_HEADER,
      });
      console.log('restored subscription data=====> ', response);
      if (response && response?.success) {
        // console.log('restored subscription data=====> ', response);

        saveUserData(response, dispatch);
        showToastMessage(response.message, 'success');
      } else {
        showToastMessage(response.message);
      }
      dispatch(loading(false));
    } catch (error) {
      dispatch(loading(false));
      showToastMessage('Subscription plan not yet purchased.');
    }
  };

  const methodSetButtonText = () => {
    let str = translateText('Purchase');

    if (
      globalThis?.userData?.is_premium &&
      purchasePlan?.productId == globalThis?.userData?.plan_id
    ) {
      str = translateText('Purchased'); //'Subscribed';
    }
    return str;
  };

  return (
    <Background>
      <View style={styles.profile_info_view}>
        <TouchableOpacity
          style={styles.image_container_view}
          onPress={() => props.navigation.goBack()}>
          <Image source={imagePath.back_icon} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.profile_name_email_view}>
          <Text style={styles.user_name_text}>
            {translateText('subscription_plans')}
          </Text>
        </View>
      </View>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.map_container}>
          {plans?.map((planData: Record<string, any>, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (planData?.plan !== 'Free') {
                    setPurchasePlan(planData);
                  }
                }}
                disabled={planData?.plan === 'Free'}
                style={[
                  styles.main_view,
                  purchasePlan?.productId === planData?.productId &&
                    styles.selectedPlanBorder,
                ]}>
                <View
                  key={index}
                  style={{
                    ...styles.render_map_view,
                  }}>
                  <Text style={styles.price_text}>
                    {planData?.plan_name ? planData?.plan_name : ''}
                    {planData?.plan !== 'Free' && planData?.plan_desc ? (
                      <Text style={styles.monthly_text}>
                        /{planData?.plan_desc}
                      </Text>
                    ) : null}
                  </Text>

                  <Text style={styles.price_text}>
                    {planData?.plan === 'Free'
                      ? ''
                      : planData?.inAppStore?.localizedPrice
                      ? planData?.inAppStore?.localizedPrice
                      : '$' + planData?.price}
                  </Text>
                </View>
                <>
                  {/* <Text style={styles.feature_text}>{planData?.feature}</Text> */}
                  {planData?.feature
                    ?.split('\n')
                    .filter((line: any) => line.trim() !== '')
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    .map((line: any, index: number) => {
                      const featureText = line.replace(/^\d+\.\s*/, '');
                      const isExcludedFeature =
                        planData?.plan === 'Free' &&
                        (featureText.toLowerCase().includes('profile boosts') ||
                          featureText
                            .toLowerCase()
                            .includes('ad-free experience'));

                      return (
                        <View key={index} style={styles.featureItem}>
                          <Image
                            source={
                              isExcludedFeature
                                ? imagePath.red_cross_icon
                                : imagePath.green_tick
                            }
                            style={styles.featureIcon}
                            resizeMode="contain"
                          />
                          <Text style={styles.feature_text}>{featureText}</Text>
                        </View>
                      );
                    })}
                </>

                {/* <View
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: 30,
                  }}>
                  {globalThis?.userData?.plan_id !== planData?.productId ? (
                    <View />
                  ) : (
                    <View style={styles.activeContainer}>
                      <Text style={styles.activePlan}>
                        {translateText('Active_Plan')}
                      </Text>
                    </View>
                  )}
                </View> */}
                <View
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: 30,
                  }}>
                  {(globalThis?.userData?.is_premium &&
                    globalThis?.userData?.plan_id === planData?.productId) ||
                  (globalThis?.userData?.is_premium === false &&
                    planData?.plan === 'Free') ? (
                    <View style={styles.activeContainer}>
                      <Text style={styles.activePlan}>
                        {translateText('Active_Plan')}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>

                <View style={styles.status_view}>
                  {Platform.OS == 'ios' ? (
                    purchasePlan?.inapp_plan_id === planData?.inapp_plan_id ? (
                      <Image
                        source={imagePath.premium_badge}
                        resizeMode="contain"
                        style={styles.tick}
                      />
                    ) : (
                      <View />
                    )
                  ) : purchasePlan?.android_plan_id ===
                    planData?.android_plan_id ? (
                    <Image
                      source={imagePath.premium_badge}
                      resizeMode="contain"
                      style={styles.tick}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppButton
          // title={globalThis?.userData?.plan_id ? 'tes' : 'aa'}
          title={methodSetButtonText()}
          disabled={
            purchasePlan?.productId === globalThis?.userData?.plan_id
              ? true
              : false
          }
          onPress={() => methodPurchase(purchasePlan)}
        />

        <AppButton
          title="Restore"
          onPress={() => {
            methodGetAvailablePurchase();
          }}
          // buttonStyle={{
          //   display:
          //     Platform.OS == 'ios' && globalThis?.userData?.is_premium
          //       ? 'flex'
          //       : 'none',
          // }}
          // eslint-disable-next-line react-native/no-inline-styles
          buttonStyle={{
            display: Platform.OS == 'ios' ? 'flex' : 'none',
          }}
        />

        <Text style={styles.itunes_text}>
          Payment will be charged to{' '}
          {Platform.OS === 'android' ? 'Google Play' : 'iTunes'} account at
          confirmation of purchase. Account will be charged for renewal within
          24-hours prior to the end of the current period, and identify the cost
          of the renewal. Subscriptions will automatically renew unless
          cancelled within 24-hours before the end of the current period. You
          can cancel anytime with your{' '}
          {Platform.OS === 'android' ? 'Google Play' : 'iTunes'} account
          settings. You can manage your subscription and auto renewal may be
          turned off by going to your{' '}
          {Platform.OS === 'android' ? 'Google Play' : 'iTunes'} account setting
          after purchase. For more information see our
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Image source={imagePath.info_icon} style={styles.infoIcon} />
            <Text style={styles.infoTitle}>
              {translateText('profile_boosts?') + ' ?'}
            </Text>
          </View>
          <Text style={styles.infoText}>
            {translateText('temporary_visibility')}
          </Text>
        </View>
        <View style={styles.policyView}>
          <Text
            onPress={() => {
              props.navigation.navigate('CmsScreen', {
                title: 'Privacy Policy',
              });
            }}
            style={styles.privacyPolicyText}>
            {translateText('privacy_policy')}
          </Text>
          <Text
            onPress={() => {
              props.navigation.navigate('CmsScreen', {
                title: 'Terms & Conditions',
              });
            }}
            style={styles.privacyPolicyText}>
            {translateText('terms_&_conditions')}
          </Text>
        </View>
      </ScrollView>
    </Background>
  );
};

export default withIAPContext(Subscription);
