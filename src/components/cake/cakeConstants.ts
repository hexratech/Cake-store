// cakeConstants.ts

export const flavorPrices: { [key: string]: string } = {
    "Vanilla":"",
    "Chocolate":"" ,
    "Red Velvet":"" ,
    "Strawberry":"" ,
    "Lemon":"" ,
};

export const sizePrices: { [key: string]: number } = {
    "6-inch": 310,
    "8-inch": 420,
    "9-inch":520,
    "10-inch":620,
};

export const layerPrices: { [key: string]: string } = {
    "Single":"base price", 
    "Double":"times 2 of the price" ,
    "Triple":"times 3 of the price", 
};

export const icingPrices: { [key: string]: string } = {
    "Buttercream":"",
    "Fondant":"",
    "Cream Cheese":"",
    "Whipped Cream":"",
    "Swiss Meringue Buttercream":"",
};

export const toppingPrices: { [key: string]: number } = {
    "Sprinkles":10,
    "Chocolate Chips":10,
    "Fresh Fruits": 30,
    "Edible Flowers":50,
    "Gold Flakes":10,
};