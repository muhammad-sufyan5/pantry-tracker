"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  InputAdornment,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  bgcolor: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const headerStyle = {
  bgcolor: "#4395b0",
  color: "#fff",
  padding: "1rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const searchButtonStyle = {
  backgroundColor: "#4395b0",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "1rem",
  padding: "0.5rem 1rem",
};

const itemButtonStyle = {
  backgroundColor: "#4395b0",
  color: "#9dc8d5",
  border: "none",
  borderRadius: "5px",
  padding: "0.5rem 1rem",
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredPantry(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPantry(inventory);
    } else {
      const filteredItems = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPantry(filteredItems);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="#4395b0b5"
      paddingBottom="2rem"
    >
      <Box sx={headerStyle}>
        <Typography variant="h1">Pantry Tracker</Typography>
        <Link
          href="https://portfolio-website-azure-seven-20.vercel.app/"
          target="_blank"
          style={{ textDecoration: "none", color: "#fff" }}
        >
          <Typography variant="h5">Muhammad Sufyan</Typography>
        </Link>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6">
            Add Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{
                style: { borderColor: "#4395b0" },
              }}
            />
            <Button
              sx={itemButtonStyle}
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        border="1px solid #ddd"
        sx={{
          width: { xs: "95%", sm: "90%", md: "75%", lg: "65%" },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          padding="1rem"
          bgcolor="#fff"
          alignItems="center"
        >
          <TextField
            id="search-bar"
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleSearch}
                    sx={searchButtonStyle}
                  >
                    <SearchIcon />
                  </Button>
                </InputAdornment>
              ),
              style: { borderColor: "#4395b0" },
            }}
          />
          <Button
            sx={itemButtonStyle}
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Stack>

        <Box
          height="60px"
          bgcolor="#4395b0"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h4"
            style={{ color: "#fff" }}
          >
            Inventory Items
          </Typography>
        </Box>
        <Stack spacing={2} padding="1rem">
          {filteredPantry.map(({ name, quantity }) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="1rem"
              bgcolor="#fff"
              borderRadius="8px"
              boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            >
              <Typography
                variant="h6"
                style={{ color: "#333" }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h6"
                style={{ color: "#333" }}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  sx={itemButtonStyle}
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  sx={itemButtonStyle}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
