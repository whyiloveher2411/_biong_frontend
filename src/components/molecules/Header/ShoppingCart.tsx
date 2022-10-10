import Badge from "components/atoms/Badge";
import Icon from "components/atoms/Icon";
import IconButton from "components/atoms/IconButton";
import Tooltip from "components/atoms/Tooltip";
import { __ } from "helpers/i18n";
import { Link } from "react-router-dom";
import useShoppingCart from "store/shoppingCart/useShoppingCart";

export default function ShoppingCart() {

    const shoppingCart = useShoppingCart();

    return (
        <Tooltip title={__("Giỏ hàng")}>
            <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                size="large"
            >
                <Badge badgeContent={shoppingCart.data.products.length ?? 0} max={10} color="secondary">
                    <Icon icon="ShoppingCartOutlined" />
                </Badge>
            </IconButton>
        </Tooltip>
    );
}
