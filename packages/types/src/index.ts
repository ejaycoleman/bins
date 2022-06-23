
export type BinType = 'General' | 'Food' | 'Recycling' | 'Garden' | 'Black bin' | 'Red recycling' | 'Blue Recycling' | 'Glass'

export type Outcome = 'Reported Missed' | 'Collection Made' | 'Side Waste' /* purple sacks */ | 
  'More Than 1 Bin' /* only 1 black bin per household*/ | 
  'Bin Not Out' | 'Wrong Bin Put Out' | 'Bin Contaminated' | 'Bin Broken' | 'Bin Too Heavy' | 'Unable To Access' | 
  'Road Closed' | 'Severe Weather' | 'Due For Collection' | 'Road Still Blocked' | 'Road Blocked' | 'Road Blocked - Access' | 
  'Not Collected' | 'Not Subscribed' | 'Collection Delayed'  
